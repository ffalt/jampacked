// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamChatService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get Chat Messages // Rights needed: stream
	 */
	async list(params: JamParameters.ChatFilterArgs): Promise<Array<Jam.Chat>> {
		return this.base.requestData<Array<Jam.Chat>>('/chat/list', params);
	}

	/**
	 * Post a Chat Message // Rights needed: stream
	 */
	async create(params: JamParameters.ChatCreateArgs): Promise<void> {
		return this.base.requestPostDataOK('/chat/create', params);
	}

	/**
	 * Remove a Chat Message // Rights needed: stream
	 */
	async remove(params: JamParameters.ChatRemoveArgs): Promise<void> {
		return this.base.requestPostDataOK('/chat/remove', params);
	}

}
