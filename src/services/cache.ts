import {Database} from './db';
import {JamApolloClient} from './apollo';
import {Doc} from './types';
import FastImage from 'react-native-fast-image';
import {snackSuccess} from './snack';
import {DocumentNode} from 'graphql';
import {buildCacheID} from './cache-query';
import {OperationVariables} from '@apollo/client/core/types';

export interface CacheState {
	isRunning: boolean;
	isStopped: boolean;
	message: string;
}

export class CacheService {
	version = 11;
	private stateSubscriptions: Array<(state: CacheState) => void> = [];
	private homeDataSubscriptions: Array<() => void> = [];
	state: CacheState = {
		isRunning: false,
		isStopped: false,
		message: ''
	};

	constructor(private db: Database, private client: JamApolloClient) {

	}

	async init(): Promise<void> {
		await this.checkDB();
	}

	async checkDB(): Promise<void> {
		const createJamTableScript = 'CREATE TABLE if not exists jam(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await this.db.query(createJamTableScript);
	}

	private async getDoc<T>(id: string): Promise<Doc<T> | undefined> {
		try {
			const results = await this.db.query('SELECT * FROM jam WHERE key=?', [id]);
			const result = results.rows.item(0);
			if (result && result.version === this.version) {
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

	private async clearDoc(id: string): Promise<void> {

		await this.db.delete('jam', {key: id});
	}

	private async setDoc<T>(id: string, data: T): Promise<void> {

		await this.clearDoc(id);
		await this.db.insert('jam', ['data', 'key', 'date', 'version'], [JSON.stringify(data), id, Date.now(), this.version]);
	}

	async getData<T>(id: string): Promise<T | undefined> {
		const data = await this.getDoc<T>(id);
		return data?.data;
	}

	async setData<T>(id: string, data: T): Promise<void> {
		await this.setDoc<T>(id, data);
	}

	async get<T>(forceRefresh: boolean, id: string, build: () => Promise<T>): Promise<T> {
		if (!forceRefresh) {
			const doc = await this.getDoc<T>(id);
			if (doc) {
				return doc.data;
			}
		}
		const result = await build();
		await this.setDoc(id, result);
		return result;
	}

	async remove(id: string): Promise<void> {
		await this.clearDoc(id);
	}

	async removeKeyStartWith(prefix: string): Promise<void> {
		if (!prefix) {
			return;
		}
		await this.db.query('DELETE FROM jam WHERE key LIKE ?', [`${prefix}%`]);
	}

	private async dropJamCache(): Promise<void> {
		const dropTableScript = 'DROP TABLE IF EXISTS jam';
		await this.db.query(dropTableScript);
		await this.checkDB();
	}

	async getCacheOrQuery<TData, TVariables extends OperationVariables, TResult>(
		query: DocumentNode,
		variables: TVariables,
		transform: (d?: TData, vars?: TVariables) => TResult | undefined,
	): Promise<TResult | undefined> {
		const queryID = buildCacheID<TVariables>(query, variables);
		if (queryID) {
			const cache = await this.getData<TResult>(queryID);
			if (cache) {
				return cache;
			}
			const result = await this.client.query<TData>({query, variables});
			return transform(result?.data, variables);
		}
	}

	private updateText(msg: string): void {
		this.notifyState({...this.state, message: msg});
	}

	private notifyState(state: CacheState): void {
		this.state = state;
		for (const update of this.stateSubscriptions) {
			update(state);
		}
	}

	async fill(): Promise<void> {
		if (this.state.isRunning) {
			return;
		}
		/*
const forceRefresh = false;
const tasks: Array<() => Promise<void>> = [
async (): Promise<void> => {
	await this.stats(forceRefresh);
},
async (): Promise<void> => {
	const index = await this.artistIndex(AlbumType.album, forceRefresh);
	artistIDs = artistIDs.concat(index.map(o => o.id));
},
async (): Promise<void> => {
	await this.folderIndex(forceRefresh);
},
async (): Promise<void> => {
	const index = await this.seriesIndex(forceRefresh);
	seriesIDs = seriesIDs.concat(index.map(o => o.id));
}
];
const total = 5;
let i = 0;
for (const task of tasks) {
i += 1;
caller.updateText(`1/${total} Caching Index ${i}/${tasks.length}`);
await task();
if (!caller.cachingData.running) {
	return;
}
}
i = 0;
for (const id of seriesIDs) {
i += 1;
caller.updateText(`2/${total} Caching Series ${i}/${seriesIDs.length}`);
await this.series(id, forceRefresh);
if (!caller.cachingData.running) {
	return;
}
}
i = 0;
for (const id of artistIDs) {
i += 1;
caller.updateText(`3/${total} Caching Artist ${i}/${artistIDs.length}`);
await this.artist(id, forceRefresh);
if (!caller.cachingData.running) {
	return;
}
}
i = 0;
for (const id of albumIDs) {
i += 1;
caller.updateText(`4/${total} Caching Albums ${i}/${albumIDs.length}`);
await this.album(id, forceRefresh);
if (!caller.cachingData.running) {
	return;
}
}
const headers = this.currentUserToken ? {Authorization: `Bearer ${this.currentUserToken}`} : undefined;
const ids = seriesIDs.concat(artistIDs).concat(albumIDs);
const images = ids.map(id => (
{
	uri: this.jam.image.url(id, 80, undefined, !headers),
	headers
}
)).concat(
ids.map(id => (
	{
		uri: this.jam.image.url(id, 300, undefined, !headers),
		headers
	}
))
);
i = 0;
for (const image of images) {
if (!caller.cachingData.running) {
	return;
}
i += 1;
caller.updateText(`5/${total} Caching Image ${i}/${images.length}`);
await new Promise<void>(resolve => {
	FastImage.preload([image],
		(_loaded, _total) => {
			// nope
		},
		(_loaded, _failed) => {
			resolve();
		});
});
}
snackSuccess('Cache optimized');
*/
		this.notifyState({isRunning: false, message: '', isStopped: false});
	}

	async clear(): Promise<void> {
		if (this.state.isRunning) {
			return;
		}
		this.notifyState({isRunning: true, message: 'Clearing...', isStopped: false});
		try {
			this.updateText('1/2 Clearing Image Cache');
			await FastImage.clearDiskCache();
			await FastImage.clearMemoryCache();
			if (this.state.isStopped) {
				this.notifyState({isRunning: false, message: '', isStopped: false});
				return;
			}
			this.updateText('2/2 Clearing Data Cache');
			await this.dropJamCache();
			this.notifyState({isRunning: false, message: '', isStopped: false});
			snackSuccess('Cache cleared');
		} catch (_) {
			this.notifyState({isRunning: false, message: '', isStopped: false});
		}
	}

	async stop(): Promise<void> {
		if (!this.state.isRunning) {
			return;
		}
		this.notifyState({...this.state, isStopped: true});
	}

	subscribeStateChangeUpdates(update: (state: CacheState) => void): void {
		this.stateSubscriptions.push(update);
	}

	unsubscribeStateChangeUpdates(update: (state: CacheState) => void): void {
		this.stateSubscriptions = this.stateSubscriptions.filter(u => u !== update);
	}

	async updateHomeData(): Promise<void> {
		await this.remove('HomeResult');
		await this.remove('UserResult');
		for (const update of this.homeDataSubscriptions) {
			update();
		}
	}

	subscribeHomeDataChangeUpdates(update: () => void): void {
		this.homeDataSubscriptions.push(update);
	}

	unsubscribeHomeDataChangeUpdates(update: () => void): void {
		this.homeDataSubscriptions = this.homeDataSubscriptions.filter(u => u !== update);
	}
}
