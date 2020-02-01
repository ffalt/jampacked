// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamAlbumService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get an album by id
	 */
	async id(params: JamParameters.Album): Promise<Jam.Album> {
		return this.base.requestData<Jam.Album>('album/id', params);
	}

	/**
	 * get albums by ids
	 */
	async ids(params: JamParameters.Albums): Promise<Array<Jam.Album>> {
		return this.base.requestData<Array<Jam.Album>>('album/ids', params);
	}

	/**
	 * get a artist list by album list type
	 */
	async list(params: JamParameters.AlbumList): Promise<Jam.AlbumList> {
		return this.base.requestData<Jam.AlbumList>('album/list', params);
	}

	/**
	 * search albums
	 */
	async search(params: JamParameters.AlbumSearch): Promise<Jam.AlbumList> {
		return this.base.requestData<Jam.AlbumList>('album/search', params);
	}

	/**
	 * get the navigation index for albums
	 */
	async index(params: JamParameters.AlbumIndex): Promise<Jam.AlbumIndex> {
		return this.base.requestData<Jam.AlbumIndex>('album/index', params);
	}

	/**
	 * get the user state (fav/rating) by album id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('album/state', params);
	}

	/**
	 * get the user states (fav/rating) by album ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('album/states', params);
	}

	/**
	 * get similar tracks of an artist by album id
	 */
	async similar_tracks(params: JamParameters.SimilarTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('album/similar/tracks', params);
	}

	/**
	 * get tracks of an album by album ids
	 */
	async tracks(params: JamParameters.AlbumTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('album/tracks', params);
	}

	/**
	 * get external album description by id
	 */
	async info(params: JamParameters.ID): Promise<Jam.Info> {
		return this.base.requestData<Jam.Info>('album/info', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('album/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('album/image', params);
	}

	/**
	 * download album tracks as binary archive // Rights needed: stream
	 */
	download_url(params: JamParameters.Download): string {
		return this.base.buildRequestUrl('album/download', params);
	}

	/**
	 * download album tracks as binary archive // Rights needed: stream
	 */
	async download_binary(params: JamParameters.Download): Promise<ArrayBuffer> {
		return this.base.binary('album/download', params);
	}

	/**
	 * fav/unfav an album
	 */
	async fav_update(params: JamParameters.Fav): Promise<void> {
		return this.base.requestPostDataOK('album/fav/update', params);
	}

	/**
	 * rate an album
	 */
	async rate_update(params: JamParameters.Rate): Promise<void> {
		return this.base.requestPostDataOK('album/rate/update', params);
	}

}
