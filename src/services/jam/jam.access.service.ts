// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamAccessService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * is the api online?
	 */
	async ping(): Promise<Jam.Ping> {
		return this.base.requestData<Jam.Ping>('ping', {});
	}

	/**
	 * check the login state
	 */
	async session(): Promise<Jam.Session> {
		return this.base.requestData<Jam.Session>('session', {});
	}

	/**
	 * login an user
	 */
	async login(params: JamParameters.Login): Promise<Jam.Session> {
		return this.base.requestPostData<Jam.Session>('login', params);
	}

	/**
	 * logout an user
	 */
	async logout(): Promise<void> {
		return this.base.requestPostDataOK('logout', {});
	}

}
