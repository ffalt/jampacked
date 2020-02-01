// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamBookmarkService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a bookmark by id
	 */
	async id(params: JamParameters.Bookmark): Promise<Jam.Bookmark> {
		return this.base.requestData<Jam.Bookmark>('bookmark/id', params);
	}

	/**
	 * get bookmarks by ids
	 */
	async ids(params: JamParameters.Bookmarks): Promise<Jam.BookmarkList> {
		return this.base.requestData<Jam.BookmarkList>('bookmark/ids', params);
	}

	/**
	 * get a bookmarks list for the calling user
	 */
	async list(params: JamParameters.BookmarkList): Promise<Jam.BookmarkList> {
		return this.base.requestData<Jam.BookmarkList>('bookmark/list', params);
	}

	/**
	 * get a bookmarks list for a track id for the calling user
	 */
	async byTrack_list(params: JamParameters.BookmarkListByTrack): Promise<Jam.BookmarkList> {
		return this.base.requestData<Jam.BookmarkList>('bookmark/byTrack/list', params);
	}

	/**
	 * create a bookmark
	 */
	async create(params: JamParameters.BookmarkCreate): Promise<Jam.Bookmark> {
		return this.base.requestPostData<Jam.Bookmark>('bookmark/create', params);
	}

	/**
	 * delete a bookmark by id
	 */
	async delete(params: JamParameters.BookmarkDelete): Promise<void> {
		return this.base.requestPostDataOK('bookmark/delete', params);
	}

	/**
	 * delete all bookmark by track ID
	 */
	async byTrack_delete(params: JamParameters.BookmarkTrackDelete): Promise<void> {
		return this.base.requestPostDataOK('bookmark/byTrack/delete', params);
	}

}
