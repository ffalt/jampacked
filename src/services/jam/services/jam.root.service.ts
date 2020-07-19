// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamRootService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get a Root by Id // Rights needed: stream
	 */
	async id(params: JamParameters.RootIdArgs): Promise<Jam.Root> {
		return this.base.requestData<Jam.Root>('/root/id', params);
	}

	/**
	 * Search Roots // Rights needed: stream
	 */
	async search(params: JamParameters.RootSearchArgs): Promise<Jam.RootPage> {
		return this.base.requestData<Jam.RootPage>('/root/search', params);
	}

	/**
	 * Get root status by id // Rights needed: stream
	 */
	async status(params: JamParameters.ID): Promise<Jam.RootUpdateStatus> {
		return this.base.requestData<Jam.RootUpdateStatus>('/root/status', params);
	}

	/**
	 * Create a root // Rights needed: stream
	 */
	async create(params: JamParameters.RootMutateArgs): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/root/create', params);
	}

	/**
	 * Update a root // Rights needed: stream
	 */
	async update(params: JamParameters.RootUpdateArgs): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/root/update', params);
	}

	/**
	 * Remove a root // Rights needed: stream
	 */
	async remove(params: JamParameters.ID): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/root/remove', params);
	}

	/**
	 * Check podcast feeds for new episodes // Rights needed: stream
	 */
	async refresh(params: JamParameters.RootRefreshArgs): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/root/refresh', params);
	}

}
