// @generated
// This file was automatically generated and should not be edited.

import { Auth } from './model/jam-auth';
import { Jam } from './model/jam-rest-data';

export abstract class JamConfiguration {
	clientName?: string;

	abstract domain(): string;

	abstract userChangeNotify(user: Jam.SessionUser | undefined): Promise<void>;

	abstract fromStorage(): Promise<{ user: Jam.SessionUser; auth: Auth } | undefined>;

	abstract toStorage(data: { user: Jam.SessionUser; auth: Auth } | undefined): Promise<void>;
}
