import {Database} from './db';

const createTableScript = 'CREATE TABLE if not exists jam(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer)';

export interface Doc<T> {
	date: number;
	data: T;
}

class DataService {
	db?: Database;

	constructor() {
		this.open();
	}

	async open(): Promise<void> {
		this.db = await Database.getInstance();
		await this.check();
	}

	async check(): Promise<void> {
		if (!this.db) {
			return;
		}
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
			if (result) {
				return {
					date: result.date,
					data: JSON.parse(result.data)
				};
			}
		} catch (e) {
			console.error(e);
		}
	}

	async get<T>(id: string, build: () => Promise<T>): Promise<T> {
		const doc = await this.getDoc<T>(id);
		if (doc) {
			return doc.data;
		}
		const result = await build();
		if (!this.db) {
			return result;
		}
		await this.db.insert('jam', ['data', 'key', 'date'], [JSON.stringify(result), id, Date.now()]);
		return result;
	}

}

const dataService = new DataService();
export default dataService;
