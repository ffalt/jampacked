// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamStatsService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get count stats for Folders/Tracks/Albums/... // Rights needed: stream
	 */
	async get(params: JamParameters.StatsFilter): Promise<Jam.Stats> {
		return this.base.requestData<Jam.Stats>('/stats', params);
	}

	/**
	 * Get count stats for the calling User: Playlists/Favorites/Played // Rights needed: stream
	 */
	async user(): Promise<Jam.UserStats> {
		return this.base.requestData<Jam.UserStats>('/stats/user', {});
	}

}
