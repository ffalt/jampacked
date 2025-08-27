import { JamStoredConfiguration } from './jam.configuration.ts';
import { JamService as BaseJamService } from './jam';

export class JamService extends BaseJamService {
	get currentUserName(): string {
		return (this.auth?.user?.name ?? '');
	}

	get currentUserID(): string {
		return (this.auth?.user?.id ?? '');
	}

	get currentUserToken(): string | undefined {
		return this.auth?.auth?.token;
	}
}

const configuration = new JamStoredConfiguration();
const jamService = new JamService(configuration);
export default jamService;
