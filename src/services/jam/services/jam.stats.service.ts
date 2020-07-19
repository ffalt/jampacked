// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamStatsService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get count Stats for Folders/Tracks/Albums/... // Rights needed: stream
	 */
	async get(params: JamParameters.StatsFilter): Promise<Jam.Stats> {
		return this.base.requestData<Jam.Stats>('/stats', params);
	}

}
