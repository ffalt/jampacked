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
	storage!: Database;

	constructor(public jam: JamService) {
	}

	async init(): Promise<JamApolloClient> {
		this.db = await Database.getInstance();
		this.client = await initApolloClient(this);
		this.cache = new CacheService(this.db, this.client);
		await this.cache.init();
		this.pin = new PinService(this);
		await this.pin.init();
		this.storage = new Database();
		await this.storage.connect('settings.db');
		await this.checkDB();
		return this.client;
	}

	async checkDB(): Promise<void> {
		const createJamTableScript = 'CREATE TABLE if not exists jam(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await this.storage.query(createJamTableScript);
	}

	async close(): Promise<void> {
		await this.db.disconnect();
		await this.storage.disconnect();
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

	public async getSetting(key: string): Promise<string | undefined> {
		const id = `jam:${this.currentUserID}:${key}`;
		const results = await this.storage.query('SELECT * FROM jam WHERE key=?', [id]);
		const result = results.rows.length > 0 ? results.rows.item(0) : undefined;
		return result?.data;
	}

	public async setSetting(key: string, value?: string): Promise<void> {
		const id = `jam:${this.currentUserID}:${key}`;
		await this.storage.delete('jam', {key: id});
		if (value) {
			await this.storage.insert('jam', ['data', 'key', 'date', 'version'], [value, id, Date.now(), 1]);
		}
	}

	// user independent settings

	public async getStored(key: string): Promise<string | undefined> {
		const id = `jam-store:${key}`;
		const results = await this.storage.query('SELECT * FROM jam WHERE key=?', [id]);
		const result = results.rows.length > 0 ? results.rows.item(0) : undefined;
		return result?.data;
	}

	public async setStored(key: string, value?: string): Promise<void> {
		const id = `jam-store:${key}`;
		await this.storage.delete('jam', {key: id});
		if (value) {
			await this.storage.insert('jam', ['data', 'key', 'date', 'version'], [value, id, Date.now(), 1]);
		}
	}
}

const configuration = new JamConfigurationService();
const dataService = new DataService(new JamService(configuration));
export default dataService;


