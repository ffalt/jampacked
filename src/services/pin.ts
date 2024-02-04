import {Doc, PinMedia, PinState, PinCacheStat, TrackEntry} from './types';
import {AudioFormatType, JamObjectType} from './jam';
import {DataService} from './data';
import {AlbumQuery} from './queries/album';
import {snackError} from './snack';
import {TrackQuery} from './queries/track';
import {FolderQuery} from './queries/folder';
import {PlaylistQuery} from './queries/playlist';
import {PodcastEpisodeQuery} from './queries/podcastEpisode';
import {humanFileSize} from '../utils/filesize.utils';
import {DownloadRequest, DownloadState, TrackPlayerDownloadManager} from './downloader-api.ts';

export class PinService {
	private pinSubscriptions = new Map<string, Array<(state: PinState) => void>>();
	private pinsChangeSubscriptions: Array<() => void> = [];
	public manager: TrackPlayerDownloadManager = new TrackPlayerDownloadManager();
	private dataFormatVersion = 1;

	constructor(private owner: DataService) {
	}

	async init(): Promise<void> {
		await this.checkDB();
		await this.manager.init();
		await this.updateHeaders();
	}

	async updateHeaders(): Promise<void> {
		const headers = this.owner.currentUserToken ? {Authorization: `Bearer ${this.owner.currentUserToken}`} : undefined;
		if (headers) {
			await this.manager.setHeaders(headers);
		}
	}

	async download(tracks: Array<TrackEntry>): Promise<void> {
		const requests: Array<DownloadRequest> = tracks.map(t => {
			return {
				id: t.id,
				url: this.owner.jam.stream.streamUrl({id: t.id, format: AudioFormatType.mp3}, false)
			};
		});
		await this.manager.download(requests);
	}

	private async dropPinCache(): Promise<void> {
		const dropTableScript: string = 'DROP TABLE IF EXISTS pin';
		await this.owner.db.query(dropTableScript);
		await this.checkDB();
	}

	private async checkDB(): Promise<void> {
		const createPinTableScript: string = 'CREATE TABLE if not exists pin(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await this.owner.db.query(createPinTableScript);
	}

	private async getPinDocs<T>(): Promise<Array<Doc<T>>> {
		try {
			const results = await this.owner.db.query('SELECT * FROM pin');
			const list: Array<Doc<T>> = [];
			for (let i = 0; i < results.rows.length; i++) {
				const result = results.rows.item(i);
				list.push({
					key: result.key,
					version: result.version,
					date: result.date,
					data: JSON.parse(result.data)
				});
			}
			return list;
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	private async getPinDoc<T>(id: string): Promise<Doc<T> | undefined> {
		try {
			const results = await this.owner.db.query('SELECT * FROM pin WHERE key=?', [id]);
			const result = results.rows.item(0);
			if (result) {
				return {
					key: result.key,
					version: result.version,
					date: result.date,
					data: JSON.parse(result.data)
				};
			}
		} catch (e) {
			console.error(e);
		}
	}

	private async clearPinDoc(key: string): Promise<void> {
		await this.owner.db.delete('pin', {key});
	}

	private async setPinDoc(id: string, data: PinMedia): Promise<void> {
		await this.setPinDocKey<PinMedia>(`pin_${id}`, data);
	}

	private async setPinDocKey<T>(key: string, data: T): Promise<void> {
		await this.clearPinDoc(key);
		await this.owner.db.insert('pin', ['data', 'key', 'date', 'version'], [JSON.stringify(data), key, Date.now(), this.dataFormatVersion]);
	}

	async hasAnyCurrentDownloads(ids: Array<string>): Promise<boolean> {
		const downloads = this.manager.getCurrentDownloads();
		return !!downloads.find(d => ids.includes(d.id));
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
		return {files, size, humanSize: humanFileSize(size)};
	}

	async getPinState(id: string): Promise<PinState> {
		const key = `pin_${id}`;
		const doc = await this.getPinDoc<PinMedia>(key);
		if (!doc) {
			return {
				active: false,
				pinned: false
			};
		}
		const active = await this.hasAnyCurrentDownloads(doc.data.tracks.map(t => t.id));
		return {
			active,
			pinned: true
		};
	}

	async pinObject(id: string, objType: JamObjectType, name: string, tracks: Array<TrackEntry>): Promise<void> {
		if (tracks.length) {
			const data: PinMedia = {id, name, objType, tracks};
			await this.setPinDoc(id, data);
			await this.download(tracks);
			this.notifyPinChange(id, {active: false, pinned: true});
		} else {
			this.notifyPinChange(id, {active: true, pinned: true});
		}
	}

	async pinAlbum(id: string): Promise<void> {
		const album = await this.owner.cache.getCacheOrQuery(AlbumQuery.query, AlbumQuery.transformVariables(id), AlbumQuery.transformData);
		if (album) {
			await this.pinObject(id, JamObjectType.album, album.name, album.tracks || []);
		} else {
			snackError(new Error('Album not found'));
		}
	}

	async pinFolder(id: string): Promise<void> {
		const folder = await this.owner.cache.getCacheOrQuery(FolderQuery.query, FolderQuery.transformVariables(id), FolderQuery.transformData);
		if (folder) {
			await this.pinObject(id, JamObjectType.folder, folder.title || id, folder.tracks || []);
		} else {
			snackError(new Error('Album not found'));
		}
	}

	async pinPlaylist(id: string): Promise<void> {
		const playlist = await this.owner.cache.getCacheOrQuery(PlaylistQuery.query, PlaylistQuery.transformVariables(id), PlaylistQuery.transformData);
		if (playlist) {
			await this.pinObject(id, JamObjectType.playlist, playlist.name || id, playlist.tracks || []);
		} else {
			snackError(new Error('Playlist not found'));
		}
	}

	async pinTrack(id: string): Promise<void> {
		const track = await this.owner.cache.getCacheOrQuery(TrackQuery.query, TrackQuery.transformVariables(id), TrackQuery.transformData);
		if (track) {
			await this.pinObject(id, JamObjectType.track, track.title || id, [track]);
		} else {
			snackError(new Error('Track not found'));
		}
	}

	async pinPodcastEpisode(id: string): Promise<void> {
		const track = await this.owner.cache.getCacheOrQuery(PodcastEpisodeQuery.query, PodcastEpisodeQuery.transformVariables(id), PodcastEpisodeQuery.transformData);
		if (track) {
			await this.pinObject(id, JamObjectType.episode, track.title || id, [track]);
		} else {
			snackError(new Error('Episode not found'));
		}
	}

	async pin(id: string, objType: JamObjectType): Promise<void> {
		this.notifyPinChange(id, {active: true, pinned: true});
		switch (objType) {
			case JamObjectType.album:
				await this.pinAlbum(id);
				break;
			case JamObjectType.track:
				await this.pinTrack(id);
				break;
			case JamObjectType.folder:
				await this.pinFolder(id);
				break;
			case JamObjectType.playlist:
				await this.pinPlaylist(id);
				break;
			case JamObjectType.episode:
				await this.pinPodcastEpisode(id);
				break;
			default: {
				snackError(new Error(`Pinning this object type is not supported: ${objType}`));
				this.notifyPinChange(id, {active: false, pinned: false});
			}
		}
		this.notifyPinsChange();
	}

	async unpin(id: string): Promise<void> {
		const key = `pin_${id}`;
		const doc = await this.getPinDoc<PinMedia>(key);
		if (doc) {
			this.notifyPinChange(id, {active: true, pinned: false});
			const ids = await this.filterPinnedByOthers(key, doc.data.tracks.map(t => t.id));
			await this.manager.remove(ids);
			await this.clearPinDoc(key);
			this.notifyPinChange(id, {active: false, pinned: false});
		}
		this.notifyPinsChange();
	}

	async getPinCount(): Promise<number> {
		// TODO: make this more efficient
		const docs = await this.getPinDocs<PinMedia>();
		return docs.length;
	}

	async getPinnedTrack(id: string): Promise<TrackEntry | undefined> {
		// TODO: make this more efficient
		const docs = await this.getPinDocs<PinMedia>();
		for (const doc of docs) {
			const track = doc.data.tracks.find(t => t.id === id);
			if (track) {
				return track;
			}
		}
	}

	async filterPinnedByOthers(currentKey: string, ids: Array<string>): Promise<Array<string>> {
		const result = ids.slice(0);
		// TODO: make this more efficient
		const docs = await this.getPinDocs<PinMedia>();
		for (const doc of docs) {
			if (doc.key === currentKey) {
				continue;
			}
			for (const track of doc.data.tracks) {
				const index = result.findIndex(s => track.id === s);
				if (index >= 0) {
					result.splice(index, 1);
				}
			}
		}
		return result;
	}

	notifyPinChange(id: string, state: PinState): void {
		const array = this.pinSubscriptions.get(id) || [];
		array.forEach(update => update(state));
	}

	subscribeCacheChangeUpdates(listen: () => void): void {
		this.manager.subscribeDownloadsChanges(listen);
	}

	unsubscribeCacheChangeUpdates(listen: () => void): void {
		this.manager.unsubscribeDownloadsChanges(listen);
	}

	subscribePinChangeUpdates(id: string, update: (state: PinState) => void): void {
		const array = this.pinSubscriptions.get(id) || [];
		array.push(update);
		this.pinSubscriptions.set(id, array);
	}

	unsubscribePinChangeUpdates(id: string, update: (state: PinState) => void): void {
		let array = this.pinSubscriptions.get(id) || [];
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
		this.pinsChangeSubscriptions.forEach(update => update());
	}

	async clearPins(): Promise<void> {
		await this.manager.clear();
		await this.dropPinCache();
	}

	async getPins(): Promise<Array<PinMedia>> {
		const docs = await this.getPinDocs<PinMedia>();
		return docs.map(doc => doc.data);
	}

}
