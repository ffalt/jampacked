// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamRadioService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a radio by id
	 */
	async id(params: JamParameters.Radio): Promise<Jam.Radio> {
		return this.base.requestData<Jam.Radio>('radio/id', params);
	}

	/**
	 * get radios by ids
	 */
	async ids(params: JamParameters.Radios): Promise<Array<Jam.Radio>> {
		return this.base.requestData<Array<Jam.Radio>>('radio/ids', params);
	}

	/**
	 * search radios
	 */
	async search(params: JamParameters.RadioSearch): Promise<Jam.RadioList> {
		return this.base.requestData<Jam.RadioList>('radio/search', params);
	}

	/**
	 * get the user state (fav/rating) by radio id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('radio/state', params);
	}

	/**
	 * get the user states (fav/rating) by radio ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('radio/states', params);
	}

	/**
	 * create an internet radio entry // Rights needed: admin
	 */
	async create(params: JamParameters.RadioNew): Promise<Jam.Radio> {
		return this.base.requestPostData<Jam.Radio>('radio/create', params);
	}

	/**
	 * update an internet radio entry // Rights needed: admin
	 */
	async update(params: JamParameters.RadioUpdate): Promise<void> {
		return this.base.requestPostDataOK('radio/update', params);
	}

	/**
	 * delete an internet radio entry // Rights needed: admin
	 */
	async delete(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('radio/delete', params);
	}

}
