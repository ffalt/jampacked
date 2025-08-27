import dbService from './db.service.ts';
import jamService from './jam.service.ts';

class StorageService {
	version = 1;

	async init(): Promise<void> {
		await this.checkDB();
	}

	async checkDB(): Promise<void> {
		const createJamTableScript = 'CREATE TABLE if not exists store(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await dbService.query(createJamTableScript);
	}

	async getValue(id: string): Promise<string | undefined> {
		const results = await dbService.query('SELECT * FROM store WHERE key=?', [id]);
		const result = results.rows && results.rows.length > 0 ? results.rows.item(0) : undefined;
		return result?.['data'] as string | undefined;
	}

	async setValue(id: string, value?: string): Promise<void> {
		await dbService.delete('store', { key: id });
		if (value) {
			await dbService.insert('store', ['data', 'key', 'date', 'version'], [value, id, Date.now(), 1]);
		}
	}

	async getSetting(key: string): Promise<string | undefined> {
		return storageService.getValue(`jam:${jamService.currentUserID}:${key}`);
	}

	async setSetting(key: string, value?: string): Promise<void> {
		return storageService.setValue(`jam:${jamService.currentUserID}:${key}`, value);
	}

	// user independent settings

	async getStored(key: string): Promise<string | undefined> {
		return storageService.getValue(`jam-store:${key}`);
	}

	async setStored(key: string, value?: string): Promise<void> {
		return storageService.setValue(`jam-store:${key}`, value);
	}
}

const storageService = new StorageService();
export default storageService;
