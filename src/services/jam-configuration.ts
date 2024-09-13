import {Auth, Jam, JamConfiguration} from './jam';
import SInfo from 'react-native-sensitive-info';

const STORE_KEY = 'credentials';

export class JamConfigurationService implements JamConfiguration {
	public clientName = 'Jam';
	public storeConfig = {
		sharedPreferencesName: 'jam',
		keychainService: 'jam'
	};

	public domain(): string {
		return '';
	}

	async fromStorage(): Promise<{ user: Jam.SessionUser; auth: Auth } | undefined> {
		try {
			const credentials = await SInfo.getItem(STORE_KEY, this.storeConfig);
			return credentials ? JSON.parse(credentials) : undefined;
		} catch (_) {
			return;
		}
	}

	async toStorage(data: { user: Jam.SessionUser; auth: Auth } | undefined): Promise<void> {
		if (data) {
			await SInfo.setItem(STORE_KEY, JSON.stringify(data), this.storeConfig);
		} else {
			await SInfo.deleteItem(STORE_KEY, this.storeConfig);
		}
	}

	async userChangeNotify(/* user: Jam.SessionUser | undefined */): Promise<void> {
		// console.log('Changed User', user);
	}

}
