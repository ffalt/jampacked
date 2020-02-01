// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamAdminService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get admin settings for the server // Rights needed: admin
	 */
	async settings(): Promise<Jam.AdminSettings> {
		return this.base.requestData<Jam.AdminSettings>('admin/settings', {});
	}

	/**
	 * get admin change request status // Rights needed: admin
	 */
	async queue_id(params: JamParameters.ID): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestData<Jam.AdminChangeQueueInfo>('admin/queue/id', params);
	}

	/**
	 * update admin settings for the server // Rights needed: admin
	 */
	async settings_update(params: Jam.AdminSettings): Promise<void> {
		return this.base.requestPostDataOK('admin/settings/update', params);
	}

}
