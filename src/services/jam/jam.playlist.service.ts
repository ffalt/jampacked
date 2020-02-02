// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamPlaylistService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a playlist by id
	 */
	async id(params: JamParameters.Playlist): Promise<Jam.Playlist> {
		return this.base.requestData<Jam.Playlist>('playlist/id', params);
	}

	/**
	 * get playlists by ids
	 */
	async ids(params: JamParameters.Playlists): Promise<Array<Jam.Playlist>> {
		return this.base.requestData<Array<Jam.Playlist>>('playlist/ids', params);
	}

	/**
	 * search playlists
	 */
	async search(params: JamParameters.PlaylistSearch): Promise<Jam.PlaylistList> {
		return this.base.requestData<Jam.PlaylistList>('playlist/search', params);
	}

	/**
	 * get the user state (fav/rating) by playlist id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('playlist/state', params);
	}

	/**
	 * get the user states (fav/rating) by playlist ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('playlist/states', params);
	}

	/**
	 * get tracks of a playlist(s) by playlist ids
	 */
	async tracks(params: JamParameters.PlaylistTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('playlist/tracks', params);
	}

	/**
	 * get a playlist list by playlist list type
	 */
	async list(params: JamParameters.PlaylistList): Promise<Jam.PlaylistList> {
		return this.base.requestData<Jam.PlaylistList>('playlist/list', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('playlist/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('playlist/image', params);
	}

	/**
	 * download playlist tracks as binary archive // Rights needed: stream
	 */
	download_url(params: JamParameters.Download): string {
		return this.base.buildRequestUrl('playlist/download', params);
	}

	/**
	 * download playlist tracks as binary archive // Rights needed: stream
	 */
	async download_binary(params: JamParameters.Download): Promise<ArrayBuffer> {
		return this.base.binary('playlist/download', params);
	}

	/**
	 * create a playlist
	 */
	async create(params: JamParameters.PlaylistNew): Promise<Jam.Playlist> {
		return this.base.requestPostData<Jam.Playlist>('playlist/create', params);
	}

	/**
	 * update a playlist
	 */
	async update(params: JamParameters.PlaylistUpdate): Promise<void> {
		return this.base.requestPostDataOK('playlist/update', params);
	}

	/**
	 * fav/unfav a playlist
	 */
	async fav_update(params: JamParameters.Fav): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('playlist/fav/update', params);
	}

	/**
	 * rate a playlist
	 */
	async rate_update(params: JamParameters.Rate): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('playlist/rate/update', params);
	}

	/**
	 * delete a playlist
	 */
	async delete(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('playlist/delete', params);
	}

}
