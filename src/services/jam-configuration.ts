import * as Keychain from 'react-native-keychain';
import {Auth, Jam, JamConfiguration} from './jam';

export class JamConfigurationService implements JamConfiguration {
	public clientName = 'Jam';

	public domain(): string {
		return '';
	}

	async fromStorage(): Promise<{ user: Jam.SessionUser; auth: Auth } | undefined> {
		const credentials = await Keychain.getGenericPassword();
		const result = credentials ? JSON.parse(credentials.password) : undefined;
		// if (__DEV__ && result) {
		// 	console.error(result);
		// }
		return result;
	}

	async toStorage(data: { user: Jam.SessionUser; auth: Auth } | undefined): Promise<void> {
		if (data) {
			await Keychain.setGenericPassword('jam', JSON.stringify(data));
		} else {
			await Keychain.resetGenericPassword();
		}
	}

	async userChangeNotify(/* user: Jam.SessionUser | undefined */): Promise<void> {
		// console.log('Changed User', user);
	}

}
