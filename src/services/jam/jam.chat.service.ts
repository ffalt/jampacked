// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamChatService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get chat messages
	 */
	async list(params: JamParameters.Chat): Promise<Array<Jam.ChatMessage>> {
		return this.base.requestData<Array<Jam.ChatMessage>>('chat/list', params);
	}

	/**
	 * create a chat message
	 */
	async create(params: JamParameters.ChatNew): Promise<void> {
		return this.base.requestPostDataOK('chat/create', params);
	}

	/**
	 * delete a chat message
	 */
	async delete(params: JamParameters.ChatDelete): Promise<void> {
		return this.base.requestPostDataOK('chat/delete', params);
	}

}
