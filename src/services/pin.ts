import {Database} from './db';
import {Doc, PinMedia, PinState, TrackEntry} from './types';
import {MediaCache} from './media-cache';
import {AudioFormatType, JamObjectType} from './jam';
import {getAlbum} from './queries/album';
import {DownloadTask} from 'react-native-background-downloader';
import {JamApolloClient} from './apollo';
import dataService from './data';

export class PinService {
	private pinSubscriptions = new Map<string, Array<(state: PinState) => void>>();
	pinCache = new MediaCache();
	private dataFormatVersion = 1;

	constructor(private db: Database, private client: JamApolloClient) {
	}

	async init(): Promise<void> {
		await this.pinCache.init();
		await this.checkDB();
	}

	async isDownloaded(id: string): Promise<boolean> {
		return this.pinCache.isDownloaded(id);
	}

	async download(tracks: Array<TrackEntry>): Promise<void> {
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		const downloads = tracks.map(t => {
			return {
				id: t.id,
				url: dataService.jam.stream.streamUrl({id: t.id, format: AudioFormatType.mp3}, !headers),
				destination: this.pinCache.pathInCache(t.id),
				tag: t.title,
				headers
			};
		});
		return this.pinCache.download(downloads);
	}

	private async dropPinCache(): Promise<void> {
		const dropTableScript = 'DROP TABLE IF EXISTS pin';
		await this.db.query(dropTableScript);
		await this.checkDB();
	}

	private async checkDB(): Promise<void> {
		const createPinTableScript = 'CREATE TABLE if not exists pin(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await this.db.query(createPinTableScript);
	}

	private async getPinDocs<T>(): Promise<Array<Doc<T>>> {
		try {
			const results = await this.db.query('SELECT * FROM pin');
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
			const results = await this.db.query('SELECT * FROM pin WHERE key=?', [id]);
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

		await this.db.delete('pin', {key});
	}

	private async setPinDoc<T>(key: string, data: T): Promise<void> {
		await this.clearPinDoc(key);
		await this.db.insert('pin', ['data', 'key', 'date', 'version'], [JSON.stringify(data), key, Date.now(), this.dataFormatVersion]);
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
		const active = this.pinCache.hasAnyDownloadTask(doc.data.tracks.map(t => t.id));
		if (active) {
			const array = this.pinSubscriptions.get(id);
			if (array?.length) {
				this.waitForPin(id, doc.data);
			}
		}
		return {
			active,
			pinned: true
		};
	}

	async pin(id: string, objType: JamObjectType): Promise<void> {
		const key = `pin_${id}`;
		this.notifyPinChange(id, {active: true, pinned: true});
		const album = await getAlbum(id, this.client);
		if (album) {
			const data: PinMedia = {id, name: album.name, objType, tracks: album.tracks || []};
			await this.setPinDoc<PinMedia>(key, data);
			await this.download(album.tracks || []);
			this.waitForPin(id, data);
		} else {
			this.notifyPinChange(id, {active: false, pinned: false});
		}
	}

	private waitForPin(id: string, data: PinMedia): void {
		const waitForIDs = data.tracks.map(t => t.id);
		const update = (tasks: Array<DownloadTask>): void => {
			const task = tasks.find(task => waitForIDs.includes(task.id));
			if (!task || tasks.length === 0) {
				this.pinCache.unsubscribeTaskUpdates(update);
				this.notifyPinChange(id, {active: false, pinned: true});
			}
		};
		this.pinCache.subscribeTaskUpdates(update);
	}

	async unpin(id: string): Promise<void> {
		const key = `pin_${id}`;
		const doc = await this.getPinDoc<PinMedia>(key);
		if (doc) {
			this.notifyPinChange(id, {active: true, pinned: false});
			const ids = doc.data.tracks.map(t => t.id);
			await this.pinCache.cancelTasks(ids);
			await this.pinCache.removeFromCache(ids);
			await this.clearPinDoc(key);
			this.notifyPinChange(id, {active: false, pinned: false});
		}
	}

	notifyPinChange(id: string, state: PinState): void {
		const array = this.pinSubscriptions.get(id) || [];
		array.forEach(update => {
			update(state);
		});
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

	async clearPins(): Promise<void> {
		await this.pinCache.clear();
		await this.dropPinCache();
	}

	async getPins(): Promise<Array<PinMedia>> {
		const docs = await this.getPinDocs<PinMedia>();
		return docs.map(doc => doc.data);
	}

}
