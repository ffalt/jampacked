import AsyncStorage from '@react-native-community/async-storage';
import {Database} from './db';
import {JamService} from './jam';
import {JamConfigurationService} from './jam-configuration';
import {initApolloClient, JamApolloClient} from './apollo';
import {PinService} from './pin';
import {CacheService} from './cache';

export class DataService {
	db!: Database;
	client!: JamApolloClient;
	pin!: PinService;
	cache!: CacheService;

	constructor(public jam: JamService) {
	}

	async init(): Promise<JamApolloClient> {
		this.db = await Database.getInstance();
		this.client = await initApolloClient(this);
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
		await this.cache.updateHomeData();
	}

	// user dependent settings

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

	// user independent settings

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
}

const configuration = new JamConfigurationService();
const dataService = new DataService(new JamService(configuration));
export default dataService;


