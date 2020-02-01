// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamUserService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get an user by id // Rights needed: admin
	 */
	async id(params: JamParameters.ID): Promise<Jam.User> {
		return this.base.requestData<Jam.User>('user/id', params);
	}

	/**
	 * get users by ids // Rights needed: admin
	 */
	async ids(params: JamParameters.IDs): Promise<Array<Jam.User>> {
		return this.base.requestData<Array<Jam.User>>('user/ids', params);
	}

	/**
	 * search users // Rights needed: admin
	 */
	async search(params: JamParameters.UserSearch): Promise<Jam.UserList> {
		return this.base.requestData<Jam.UserList>('user/search', params);
	}

	/**
	 * get infos about the user sessions
	 */
	async sessions_list(): Promise<Array<Jam.UserSession>> {
		return this.base.requestData<Array<Jam.UserSession>>('user/sessions/list', {});
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('user/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('user/image', params);
	}

	/**
	 * create a new user // Rights needed: admin
	 */
	async create(params: JamParameters.UserNew): Promise<Jam.User> {
		return this.base.requestPostData<Jam.User>('user/create', params);
	}

	/**
	 * update user // Rights needed: admin
	 */
	async update(params: JamParameters.UserUpdate): Promise<void> {
		return this.base.requestPostDataOK('user/update', params);
	}

	/**
	 * set a password for the user
	 */
	async password_update(params: JamParameters.UserPasswordUpdate): Promise<void> {
		return this.base.requestPostDataOK('user/password/update', params);
	}

	/**
	 * set an email for an user
	 */
	async email_update(params: JamParameters.UserEmailUpdate): Promise<void> {
		return this.base.requestPostDataOK('user/email/update', params);
	}

	/**
	 * set an random avatar image for a user (only admins can change images for other users than the current)
	 */
	async image_random(params: JamParameters.UserImageRandom): Promise<void> {
		return this.base.requestPostDataOK('user/image/random', params);
	}

	/**
	 * set an avatar image for an user
	 */
	async imageUpload_update(params: JamParameters.ID, file: any, onUploadProgress: (progressEvent: any) => void): Promise<void> {
		return this.base.upload('user/imageUpload/update', params, 'image', file, onUploadProgress);
	}

	/**
	 * delete an user // Rights needed: admin
	 */
	async delete(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('user/delete', params);
	}

	/**
	 * remove an user session
	 */
	async sessions_delete(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('user/sessions/delete', params);
	}

	/**
	 * get infos about the user subsonic token
	 */
	async sessions_subsonic_view(params: JamParameters.SubsonicToken): Promise<Jam.SubsonicToken> {
		return this.base.requestPostData<Jam.SubsonicToken>('user/sessions/subsonic/view', params);
	}

	/**
	 * generate a user subsonic token
	 */
	async sessions_subsonic_generate(params: JamParameters.SubsonicToken): Promise<Jam.SubsonicToken> {
		return this.base.requestPostData<Jam.SubsonicToken>('user/sessions/subsonic/generate', params);
	}

}
