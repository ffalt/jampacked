import { Database } from './db';
import { JamService } from './jam';
import { JamConfigurationService } from './jam-configuration';
import { initApolloClient, JamApolloClient } from './apollo';
import { PinService } from './pin';
import { CacheService } from './cache';
import { StorageService } from './storage';

export class DataService {
	db!: Database;
	client!: JamApolloClient;
	pin!: PinService;
	cache!: CacheService;
	storage!: StorageService;

	constructor(public jam: JamService) {
	}

	async init(): Promise<JamApolloClient> {
		await this.jam.auth.load();
		this.db = await Database.getInstance();
		this.client = await initApolloClient(this);
		this.storage = new StorageService(this.db);
		await this.storage.init();
		this.cache = new CacheService(this.db, this.client);
		await this.cache.init();
		this.pin = new PinService(this);
		await this.pin.init();
		return this.client;
	}

	async close(): Promise<void> {
		await this.db.disconnect();
	}

	// auth

	get currentUserName(): string {
		return (this.jam.auth?.user?.name ?? '');
	}

	get currentUserID(): string {
		return (this.jam.auth?.user?.id ?? '');
	}

	get currentUserToken(): string | undefined {
		return this.jam.auth?.auth?.token;
	}

	// data

	async scrobble(id: string): Promise<void> {
		await this.jam.nowplaying.scrobble({ id });
		await this.cache.updateHomeData();
	}

	// user dependent settings

	async getSetting(key: string): Promise<string | undefined> {
		return this.storage.getValue(`jam:${this.currentUserID}:${key}`);
	}

	async setSetting(key: string, value?: string): Promise<void> {
		return this.storage.setValue(`jam:${this.currentUserID}:${key}`, value);
	}

	// user independent settings

	async getStored(key: string): Promise<string | undefined> {
		return this.storage.getValue(`jam-store:${key}`);
	}

	async setStored(key: string, value?: string): Promise<void> {
		return this.storage.setValue(`jam-store:${key}`, value);
	}
}

const configuration = new JamConfigurationService();
const dataService = new DataService(new JamService(configuration));
export default dataService;
