import * as Keychain from 'react-native-keychain';
import {Jam, JamConfiguration, Auth} from './jam';

export class JamConfigurationService implements JamConfiguration {
	public clientName = 'Jam';

	public domain(): string {
		return '';
	}

	async fromStorage(): Promise<{ user: Jam.SessionUser; auth: Auth } | undefined> {
		const credentials = await Keychain.getGenericPassword();
		return credentials ? JSON.parse(credentials.password) : undefined;
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
