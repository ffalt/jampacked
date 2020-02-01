// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamRootService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a root by id
	 */
	async id(params: JamParameters.ID): Promise<Jam.Root> {
		return this.base.requestData<Jam.Root>('root/id', params);
	}

	/**
	 * get roots by ids
	 */
	async ids(params: JamParameters.IDs): Promise<Array<Jam.Root>> {
		return this.base.requestData<Array<Jam.Root>>('root/ids', params);
	}

	/**
	 * search roots
	 */
	async search(params: JamParameters.RootSearch): Promise<Jam.RootList> {
		return this.base.requestData<Jam.RootList>('root/search', params);
	}

	/**
	 * scanning status of a root scan by root id
	 */
	async status(params: JamParameters.ID): Promise<Jam.RootStatus> {
		return this.base.requestData<Jam.RootStatus>('root/status', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('root/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('root/image', params);
	}

	/**
	 * create a root folder // Rights needed: admin
	 */
	async create(params: JamParameters.RootNew): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('root/create', params);
	}

	/**
	 * update root folder properties // Rights needed: admin
	 */
	async update(params: JamParameters.RootUpdate): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('root/update', params);
	}

	/**
	 * remove a root folder // Rights needed: admin
	 */
	async delete(params: JamParameters.ID): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('root/delete', params);
	}

	/**
	 * start a root refresh by root id // Rights needed: admin
	 */
	async refresh(params: JamParameters.RootRefresh): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('root/refresh', params);
	}

	/**
	 * start refresh of all roots // Rights needed: admin
	 */
	async refreshAll(params: JamParameters.RootRefreshAll): Promise<Array<Jam.AdminChangeQueueInfo>> {
		return this.base.requestPostData<Array<Jam.AdminChangeQueueInfo>>('root/refreshAll', params);
	}

}
