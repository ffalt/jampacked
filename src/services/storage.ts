import { Database } from './db';

export class StorageService {
	version = 1;

	constructor(private db: Database) {

	}

	async init(): Promise<void> {
		await this.checkDB();
	}

	async checkDB(): Promise<void> {
		const createJamTableScript = 'CREATE TABLE if not exists store(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await this.db.query(createJamTableScript);
	}

	async getValue(id: string): Promise<string> {
		const results = await this.db.query('SELECT * FROM store WHERE key=?', [id]);
		const result = results.rows.length > 0 ? results.rows.item(0) : undefined;
		return result?.data;
	}

	async setValue(id: string, value?: string): Promise<void> {
		await this.db.delete('store', { key: id });
		if (value) {
			await this.db.insert('store', ['data', 'key', 'date', 'version'], [value, id, Date.now(), 1]);
		}
	}
}
