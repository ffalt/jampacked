import {Doc, PinMedia, PinState, TrackEntry} from './types';
import {DownloadOption, DownloadTask, MediaCache} from './media-cache';
import {AudioFormatType, JamObjectType} from './jam';
import {DataService} from './data';
import {AlbumQuery} from './queries/album';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import {EmitterSubscription} from 'react-native';

export class PinService {
	pinCache = new MediaCache();
	private dataFormatVersion = 1;
	private pinsChangeEmitter = new EventEmitter();
	private pinChangeEmitter = new EventEmitter();

	constructor(private owner: DataService) {
	}

	async init(): Promise<void> {
		await this.pinCache.init();
		await this.checkDB();
	}

	async isDownloaded(id: string): Promise<boolean> {
		return this.pinCache.isDownloaded(id);
	}

	async download(tracks: Array<TrackEntry>): Promise<void> {
		const headers = this.owner.currentUserToken ? {Authorization: `Bearer ${this.owner.currentUserToken}`} : undefined;
		const downloads: Array<DownloadOption> = tracks.map(t => {
			return {
				id: t.id,
				url: this.owner.jam.stream.streamUrl({id: t.id, format: AudioFormatType.mp3}, !headers),
				destination: this.pinCache.pathInCache(t.id),
				headers,
				metadata: {
					title: t.title
				},
				isAllowedOverRoaming: false,
				isAllowedOverMetered: true,
				isNotificationVisible: true
			};
		});
		return this.pinCache.download(downloads);
	}

	private async dropPinCache(): Promise<void> {
		const dropTableScript = 'DROP TABLE IF EXISTS pin';
		await this.owner.db.query(dropTableScript);
		await this.checkDB();
		this.pinsChangeEmitter.emit('pin');
	}

	private async checkDB(): Promise<void> {
		const createPinTableScript = 'CREATE TABLE if not exists pin(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
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

	async getPinCount(): Promise<number> {
		// TODO: SELECT COUNT(*)
		const results = await this.owner.db.query('SELECT * FROM pin');
		return results.rows.length;
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

	private async setPinDoc<T>(key: string, data: T): Promise<void> {
		await this.clearPinDoc(key);
		await this.owner.db.insert('pin', ['data', 'key', 'date', 'version'], [JSON.stringify(data), key, Date.now(), this.dataFormatVersion]);
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
		if (active && this.pinChangeEmitter.listenerCount(id) > 0) {
			this.waitForPin(id, doc.data);
		}
		return {
			active,
			pinned: true
		};
	}

	async pin(id: string, objType: JamObjectType): Promise<void> {
		const key = `pin_${id}`;
		this.notifyPinChange(id, {active: true, pinned: true});
		const album = await this.owner.cache.getCacheOrQuery(AlbumQuery.query, AlbumQuery.transformVariables(id), AlbumQuery.transformData);
		if (album) {
			const data: PinMedia = {id, name: album.name, objType, tracks: album.tracks || []};
			await this.setPinDoc<PinMedia>(key, data);
			await this.download(album.tracks || []);
			this.waitForPin(id, data);
			this.pinsChangeEmitter.emit('pin');
		} else {
			this.notifyPinChange(id, {active: false, pinned: false});
		}
	}

	private waitForPin(id: string, data: PinMedia): void {
		const waitForIDs = data.tracks.map(t => t.id);
		const update = (tasks: Array<DownloadTask>): void => {
			const task = tasks.find(t => waitForIDs.includes(t.id));
			if (!task || tasks.length === 0) {
				subscription.remove();
				this.notifyPinChange(id, {active: false, pinned: true});
			}
		};
		const subscription = this.pinCache.subscribeTaskUpdates(update);
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
			this.pinsChangeEmitter.emit('pin');
		}
	}

	notifyPinChange(id: string, state: PinState): void {
		this.pinChangeEmitter.emit(id, state);
	}

	subscribeToPinChanges(id: string, update: (state: PinState) => void): EmitterSubscription {
		return this.pinChangeEmitter.addListener(id, update);
	}

	subscribeToPinsChanges(listener: () => void): EmitterSubscription {
		return this.pinsChangeEmitter.addListener('pin', listener);
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
