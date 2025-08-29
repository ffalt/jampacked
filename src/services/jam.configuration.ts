import { Auth, Jam, JamConfiguration } from './jam';
import Keychain, { STORAGE_TYPE } from 'react-native-keychain';

const STORE_KEY = 'react-native-keychain';

export class JamStoredConfiguration implements JamConfiguration {
	clientName = 'Jam';

	domain(): string {
		return '';
	}

	async fromStorage(): Promise<{ user: Jam.SessionUser; auth: Auth } | undefined> {
		try {
			const data = await Keychain.getGenericPassword({ service: STORE_KEY });
			if (!data) {
				return;
			}
			return JSON.parse(data.password) as { user: Jam.SessionUser; auth: Auth };
		} catch {
			return;
		}
	}

	async toStorage(data: { user: Jam.SessionUser; auth: Auth } | undefined): Promise<void> {
		if (data) {
			await Keychain.setGenericPassword('credentials', JSON.stringify(data), { service: STORE_KEY, storage: STORAGE_TYPE.AES_GCM_NO_AUTH });
		} else {
			await Keychain.resetGenericPassword({ service: STORE_KEY });
		}
	}

	async userChangeNotify(/* user: Jam.SessionUser | undefined */): Promise<void> {
		// nop
	}
}
