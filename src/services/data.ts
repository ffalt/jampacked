import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import {Database} from './db';
import {AudioFormatType, JamService} from './jam';
import {JamConfigurationService} from './jam-configuration';
import {Caching} from './caching';
import {snackSuccess} from './snack';
import {MediaCache} from './media-cache';
import {Doc, TrackEntry} from './types';
import {PersistentStorage} from 'apollo-cache-persist/types';
import {OperationVariables} from '@apollo/client/core';
import {DocumentNode} from 'graphql';
import {LazyQueryHookOptions, QueryLazyOptions} from '@apollo/client/react/types/types';
import {useLazyQuery} from '@apollo/react-hooks';
import {useCallback, useEffect, useState} from 'react';
import {ApolloError} from 'apollo-client';
import {Subject} from 'rxjs';

class DataService implements PersistentStorage<any> {
	db?: Database;
	version = 10;
	dataCaching = new Caching(
		(caller) => this.fillCache(caller),
		(caller) => this.clearCache(caller)
	);
	private mediaCache = new MediaCache();
	homeDataUpdate = new Subject();

	constructor(public jam: JamService) {
		this.open();
	}

	async notifyHomeDataChange(): Promise<void> {
		await this.removeItem('HomeResult');
		this.homeDataUpdate.next();
	}

	// PersistentStorage

	async getItem<T>(id: string): Promise<any> {
		const doc = await this.getDoc<T>(id);
		if (doc) {
			return doc.data;
		}
	}

	async setItem(id: string, data: any): Promise<void> {
		await this.setDoc(id, data);
	}

	async removeItem(id: string): Promise<void> {
		await this.clearDoc(id);
	}

	// db

	async open(): Promise<void> {
		this.db = await Database.getInstance();
		await this.check();
		await this.mediaCache.init();
	}

	async check(): Promise<void> {
		if (!this.db) {
			return;
		}
		const createTableScript = 'CREATE TABLE if not exists jam(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await this.db.query(createTableScript);
	}

	async close(): Promise<void> {
		if (this.db) {
			await this.db.disconnect();
		}
		this.db = undefined;
	}

	private async getDoc<T>(id: string): Promise<Doc<T> | undefined> {
		if (!this.db) {
			return;
		}
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

	private async clearDoc<T>(id: string): Promise<void> {
		if (!this.db) {
			return;
		}
		await this.db.delete('jam', {key: id});
	}

	private async setDoc<T>(id: string, data: T): Promise<void> {
		if (!this.db) {
			return;
		}
		await this.clearDoc(id);
		await this.db.insert('jam', ['data', 'key', 'date', 'version'], [JSON.stringify(data), id, Date.now(), this.version]);
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

	// auth

	get currentUserName(): string {
		return (this.jam.auth?.user?.name || '');
	}

	get currentUserID(): string {
		return (this.jam.auth?.user?.id || '');
	}

	get currentUserToken(): string | undefined {
		return this.jam.auth?.auth?.token;
	}

	// data

	async scrobble(id: string): Promise<void> {
		await this.jam.nowplaying.scrobble({id});
		this.notifyHomeDataChange().catch(e => console.error(e));
	}

	// caching

	private async clearCache(caller: Caching): Promise<void> {
		if (!this.db) {
			return;
		}
		caller.updateText('1/2 Clearing Image Cache');
		FastImage.clearDiskCache();
		FastImage.clearMemoryCache();
		caller.updateText('2/2 Clearing Data Cache');
		const dropTableScript = 'DROP TABLE IF EXISTS jam';
		await this.db.query(dropTableScript);
		await this.check();
		snackSuccess('Cache cleared');
	}

	private async fillCache(_caller: Caching): Promise<void> {
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
	}

	// user settings

	public async getSetting(key: string): Promise<string | null> {
		return AsyncStorage.getItem(`jam:${this.currentUserID}:${key}`);
	}

	public async setSetting(key: string, value?: string): Promise<void> {
		if (!value) {
			await AsyncStorage.removeItem(`jam:${this.currentUserID}:${key}`);
		} else {
			await AsyncStorage.setItem(`jam:${this.currentUserID}:${key}`, value);
		}
	}

	// user settings

	public async getStored(key: string): Promise<string | null> {
		return AsyncStorage.getItem(`jam-store:${key}`);
	}

	public async setStored(key: string, value?: string): Promise<void> {
		if (!value) {
			await AsyncStorage.removeItem(`jam-store:${key}`);
		} else {
			await AsyncStorage.setItem(`jam-store:${key}`, value);
		}
	}

	async isDownloaded(id: string): Promise<boolean> {
		return this.mediaCache.isDownloaded(id);
	}

	downloadedPath(id: string): string {
		return this.mediaCache.pathInCache(id);
	}

	async download(tracks: Array<TrackEntry>): Promise<void> {
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		const downloads = tracks.map(t => {
			return {
				id: t.id,
				url: dataService.jam.stream.streamUrl({id: t.id, format: AudioFormatType.mp3}, !headers),
				destination: this.mediaCache.pathInCache(t.id),
				headers
			};
		});
		return this.mediaCache.download(downloads);
	}
}

const configuration = new JamConfigurationService();
const dataService = new DataService(new JamService(configuration));
export default dataService;

export function useCacheOrLazyQuery<TData = any, TVariables = OperationVariables, TResult = any>(
	query: DocumentNode,
	transform: (d?: TData, variables?: TVariables) => TResult | undefined,
	options?: LazyQueryHookOptions<TData, TVariables>):
	[(options?: QueryLazyOptions<TVariables>, forceRefresh?: boolean) => void, { loading: boolean, error?: ApolloError, data?: TResult, called: boolean }] {
	const [result, setResult] = useState<TResult | undefined>();
	const [id, setID] = useState<string | undefined>();
	const [q, {loading, error, data, called, variables}] = useLazyQuery<TData, TVariables>(query, options);

	const execute = useCallback((queryOptions?: QueryLazyOptions<TVariables>, forceRefresh?: boolean): void => {
		const opDef = query.definitions.find(d => d.kind === 'OperationDefinition');
		if (opDef) {
			const queryID = (opDef as any).name.value + (queryOptions?.variables ? JSON.stringify(queryOptions.variables) : '');
			setID(queryID);
			if (forceRefresh) {
				q(queryOptions);
			} else {
				dataService.getItem(queryID).then(r => {
					if (r) {
						setResult(r);
					} else {
						q(queryOptions);
					}
				});
			}
		}
	}, [query, q]);

	useEffect(() => {
		const r = transform(data, variables);
		if (id && r) {
			setResult(r);
			dataService.setItem(id, r).then(() => {
				//
			});
		}
	}, [data, variables, id, transform]);

	return [execute, {loading, error, data: result, called}];
}

