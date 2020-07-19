// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';

export class JamPingService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Is the Api online?
	 */
	async ping(): Promise<Jam.Ping> {
		return this.base.requestData<Jam.Ping>('/ping', {});
	}

}
