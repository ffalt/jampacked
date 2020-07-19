// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamRadioService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get a Radio by Id // Rights needed: stream
	 */
	async id(params: JamParameters.RadioIdArgs): Promise<Jam.Radio> {
		return this.base.requestData<Jam.Radio>('/radio/id', params);
	}

	/**
	 * Get the Navigation Index for Radios // Rights needed: stream
	 */
	async index(params: JamParameters.RadioFilterArgs): Promise<Jam.RadioIndex> {
		return this.base.requestData<Jam.RadioIndex>('/radio/index', params);
	}

	/**
	 * Search Radios // Rights needed: stream
	 */
	async search(params: JamParameters.RadioSearchArgs): Promise<Jam.RadioPage> {
		return this.base.requestData<Jam.RadioPage>('/radio/search', params);
	}

	/**
	 * Create a Radio // Rights needed: stream
	 */
	async create(params: JamParameters.RadioMutateArgs): Promise<void> {
		return this.base.requestPostDataOK('/radio/create', params);
	}

	/**
	 * Update a Radio // Rights needed: stream
	 */
	async update(params: JamParameters.RadioUpdateArgs): Promise<void> {
		return this.base.requestPostDataOK('/radio/update', params);
	}

	/**
	 * Remove a Radio // Rights needed: stream
	 */
	async remove(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('/radio/remove', params);
	}

}
