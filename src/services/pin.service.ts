import { AudioFormatType, JamObjectType } from './jam';
import { AlbumQuery } from './queries/album';
import { snackError } from '../utils/snack.ts';
import { TrackQuery } from './queries/track';
import { FolderQuery } from './queries/folder';
import { PlaylistQuery } from './queries/playlist';
import { PodcastEpisodeQuery } from './queries/podcastEpisode';
import { DownloadRequest, DownloadState, TrackPlayerDownloadManager } from 'react-native-track-player';
import { humanFileSize } from '../utils/filesize.utils';
import { TrackEntry } from '../types/track.ts';
import { Document } from '../types/document.ts';
import { PinCacheStat, PinMedia, PinState } from '../types/pin.ts';
import dbService from './db.service.ts';
import jamService from './jam.service.ts';
import cacheService from './cache.service.ts';
import { Scalar } from '@op-engineering/op-sqlite';

export class PinService {
	manager: TrackPlayerDownloadManager = new TrackPlayerDownloadManager();
	private readonly pinSubscriptions = new Map<string, Array<(state: PinState) => void>>();
	private pinsChangeSubscriptions: Array<() => void> = [];
	private readonly dataFormatVersion = 1;

	async init(currentUserToken?: string): Promise<void> {
		await this.checkDB();
		await this.manager.init();
		await this.updateHeaders(currentUserToken);
	}

	async updateHeaders(currentUserToken?: string): Promise<void> {
		const headers = currentUserToken ? { Authorization: `Bearer ${currentUserToken}` } : undefined;
		if (headers) {
			await this.manager.setHeaders(headers);
		}
	}

	private async dropPinCache(): Promise<void> {
		const dropTableScript = 'DROP TABLE IF EXISTS pin';
		await dbService.query(dropTableScript);
		await this.checkDB();
	}

	private async checkDB(): Promise<void> {
		const createPinTableScript = 'CREATE TABLE if not exists pin(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await dbService.query(createPinTableScript);
	}

	private async getPinDocs<T>(): Promise<Array<Document<T>>> {
		try {
			const results = await dbService.query('SELECT * FROM pin');
			if (!results.rows) {
				return [];
			}
			const list: Array<Document<T>> = [];
			for (let index = 0; index < results.rows.length; index++) {
				const result = results.rows.at(index);
				if (result) {
					list.push(this.rowToObj<T>(result));
				}
			}
			return list;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	private rowToObj<T>(row: Record<string, Scalar>): Document<T> {
		return {
			key: row['key'] as string,
			version: row['version'] as number,
			date: row['date'] as number,
			data: JSON.parse(row['data'] as string) as T
		};
	}

	private async getPinDoc<T>(id: string): Promise<Document<T> | undefined> {
		try {
			const results = await dbService.query('SELECT * FROM pin WHERE key=?', [id]);
			const result = results.rows && results.rows.length > 0 ? results.rows.at(0) : undefined;
			if (result) {
				return this.rowToObj<T>(result);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async clearPinDoc(key: string): Promise<void> {
		await dbService.delete('pin', { key });
	}

	private async setPinDoc(id: string, data: PinMedia): Promise<void> {
		await this.setPinDocKey<PinMedia>(`pin_${id}`, data);
	}

	private async setPinDocKey<T>(key: string, data: T): Promise<void> {
		await this.clearPinDoc(key);
		await dbService.insert('pin', ['data', 'key', 'date', 'version'], [JSON.stringify(data), key, Date.now(), this.dataFormatVersion]);
	}

	async hasAnyCurrentDownloads(ids: Array<string>): Promise<boolean> {
		const downloads = this.manager.getCurrentDownloads();
		return downloads.some(d => ids.includes(d.id));
	}

	async stat(): Promise<PinCacheStat> {
		let size = 0;
		let files = 0;
		const downloads = this.manager.getDownloads();
		for (const item of downloads) {
			if (item.state === DownloadState.Completed) {
				size += Number(item.contentLength);
				files += 1;
			}
		}
		return { files, size, humanSize: humanFileSize(size) };
	}

	async getPinState(id: string): Promise<PinState> {
		const key = `pin_${id}`;
		const document = await this.getPinDoc<PinMedia>(key);
		if (!document) {
			return {
				active: false,
				pinned: false
			};
		}
		const active = await this.hasAnyCurrentDownloads(document.data.tracks.map(t => t.id));
		return {
			active,
			pinned: true
		};
	}

	async pinObject(id: string, objectType: JamObjectType, name: string, tracks: Array<TrackEntry>): Promise<void> {
		const requests: Array<DownloadRequest> = tracks.map(track => ({
			id: track.id,
			url: jamService.stream.streamUrl({ id: track.id, format: AudioFormatType.mp3 }, false)
		}));
		if (requests.length > 0) {
			const data: PinMedia = { id, name, objType: objectType, tracks };
			await this.setPinDoc(id, data);
			await this.manager.download(requests);
			this.notifyPinChange(id, { active: false, pinned: true });
		} else {
			this.notifyPinChange(id, { active: true, pinned: true });
		}
	}

	async pinAlbum(id: string): Promise<void> {
		const album = await cacheService.getCacheOrQuery(AlbumQuery.query, AlbumQuery.transformVariables(id), AlbumQuery.transformData);
		if (album) {
			await this.pinObject(id, JamObjectType.album, album.name, album.tracks ?? []);
		} else {
			snackError(new Error('Album not found'));
		}
	}

	async pinFolder(id: string): Promise<void> {
		const folder = await cacheService.getCacheOrQuery(FolderQuery.query, FolderQuery.transformVariables(id), FolderQuery.transformData);
		if (folder) {
			await this.pinObject(id, JamObjectType.folder, folder.title ?? id, folder.tracks ?? []);
		} else {
			snackError(new Error('Album not found'));
		}
	}

	async pinPlaylist(id: string): Promise<void> {
		const playlist = await cacheService.getCacheOrQuery(PlaylistQuery.query, PlaylistQuery.transformVariables(id), PlaylistQuery.transformData);
		if (playlist) {
			await this.pinObject(id, JamObjectType.playlist, playlist.name ?? id, playlist.tracks ?? []);
		} else {
			snackError(new Error('Playlist not found'));
		}
	}

	async pinTrack(id: string): Promise<void> {
		const track = await cacheService.getCacheOrQuery(TrackQuery.query, TrackQuery.transformVariables(id), TrackQuery.transformData);
		if (track) {
			await this.pinObject(id, JamObjectType.track, track.title ?? id, [track]);
		} else {
			snackError(new Error('Track not found'));
		}
	}

	async pinPodcastEpisode(id: string): Promise<void> {
		const track = await cacheService.getCacheOrQuery(PodcastEpisodeQuery.query, PodcastEpisodeQuery.transformVariables(id), PodcastEpisodeQuery.transformData);
		if (track) {
			await this.pinObject(id, JamObjectType.episode, track.title ?? id, [track]);
		} else {
			snackError(new Error('Episode not found'));
		}
	}

	async pin(id: string, objectType: JamObjectType): Promise<void> {
		this.notifyPinChange(id, { active: true, pinned: true });
		switch (objectType) {
			case JamObjectType.album: {
				await this.pinAlbum(id);
				break;
			}
			case JamObjectType.track: {
				await this.pinTrack(id);
				break;
			}
			case JamObjectType.folder: {
				await this.pinFolder(id);
				break;
			}
			case JamObjectType.playlist: {
				await this.pinPlaylist(id);
				break;
			}
			case JamObjectType.episode: {
				await this.pinPodcastEpisode(id);
				break;
			}
			default: {
				snackError(new Error(`Pinning this object type is not supported: ${objectType}`));
				this.notifyPinChange(id, { active: false, pinned: false });
			}
		}
		this.notifyPinsChange();
	}

	async unpin(id: string): Promise<void> {
		const key = `pin_${id}`;
		const document = await this.getPinDoc<PinMedia>(key);
		if (document) {
			this.notifyPinChange(id, { active: true, pinned: false });
			const ids = await this.filterPinnedByOthers(key, document.data.tracks.map(t => t.id));
			await this.manager.remove(ids);
			await this.clearPinDoc(key);
			this.notifyPinChange(id, { active: false, pinned: false });
		}
		this.notifyPinsChange();
	}

	async getPinCount(): Promise<number> {
		// TODO: make this more efficient
		const documents = await this.getPinDocs<PinMedia>();
		return documents.length;
	}

	async getPinnedTrack(id: string): Promise<TrackEntry | undefined> {
		// TODO: make this more efficient
		const documents = await this.getPinDocs<PinMedia>();
		for (const document of documents) {
			const track = document.data.tracks.find(t => t.id === id);
			if (track) {
				return track;
			}
		}
	}

	async filterPinnedByOthers(currentKey: string, ids: Array<string>): Promise<Array<string>> {
		const result = [...ids];
		// TODO: make this more efficient
		const documents = await this.getPinDocs<PinMedia>();
		for (const document of documents) {
			if (document.key === currentKey) {
				continue;
			}
			for (const track of document.data.tracks) {
				const index = result.indexOf(track.id);
				if (index !== -1) {
					result.splice(index, 1);
				}
			}
		}
		return result;
	}

	notifyPinChange(id: string, state: PinState): void {
		const array = this.pinSubscriptions.get(id) ?? [];
		for (const update of array) {
			update(state);
		}
	}

	subscribeCacheChangeUpdates(listen: () => void): void {
		this.manager.subscribeDownloadsChanges(listen);
	}

	unsubscribeCacheChangeUpdates(listen: () => void): void {
		this.manager.unsubscribeDownloadsChanges(listen);
	}

	subscribePinChangeUpdates(id: string, update: (state: PinState) => void): void {
		const array = this.pinSubscriptions.get(id) ?? [];
		array.push(update);
		this.pinSubscriptions.set(id, array);
	}

	unsubscribePinChangeUpdates(id: string, update: (state: PinState) => void): void {
		let array = this.pinSubscriptions.get(id) ?? [];
		array = array.splice(array.indexOf(update), 1);
		if (array.length === 0) {
			this.pinSubscriptions.delete(id);
		} else {
			this.pinSubscriptions.set(id, array);
		}
	}

	subscribePinsChangeSubscriptions(listen: () => void): void {
		this.pinsChangeSubscriptions.push(listen);
	}

	unsubscribePinsChangeSubscriptions(listen: () => void): void {
		this.pinsChangeSubscriptions = this.pinsChangeSubscriptions.filter(u => u !== listen);
	}

	notifyPinsChange(): void {
		this.updateList(this.pinsChangeSubscriptions);
	}

	updateList(updates: Array<() => void>): void {
		for (const update of updates) {
			update();
		}
	}

	async clearPins(): Promise<void> {
		await this.manager.clear();
		await this.dropPinCache();
	}

	async getPins(): Promise<Array<PinMedia>> {
		const documents = await this.getPinDocs<PinMedia>();
		return documents.map(document => document.data);
	}
}

const pinService = new PinService();
export default pinService;
