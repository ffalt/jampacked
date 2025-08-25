import { Auth, Jam, JamConfiguration } from './jam';
import SInfo from 'react-native-sensitive-info';

const STORE_KEY = 'credentials';

export class JamConfigurationService implements JamConfiguration {
	clientName = 'Jam';
	storeConfig = {
		sharedPreferencesName: 'jam',
		keychainService: 'jam'
	};

	domain(): string {
		return '';
	}

	async fromStorage(): Promise<{ user: Jam.SessionUser; auth: Auth } | undefined> {
		try {
			const credentials = await SInfo.getItem(STORE_KEY, this.storeConfig);
			return credentials ? JSON.parse(credentials) as { user: Jam.SessionUser; auth: Auth } : undefined;
		} catch {
			return;
		}
	}

	async toStorage(data: { user: Jam.SessionUser; auth: Auth } | undefined): Promise<void> {
		await (data ? SInfo.setItem(STORE_KEY, JSON.stringify(data), this.storeConfig) : SInfo.deleteItem(STORE_KEY, this.storeConfig));
	}

	async userChangeNotify(/* user: Jam.SessionUser | undefined */): Promise<void> {
		// nop
	}
}
