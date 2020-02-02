// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamTrackService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a track by id
	 */
	async id(params: JamParameters.Track): Promise<Jam.Track> {
		return this.base.requestData<Jam.Track>('track/id', params);
	}

	/**
	 * get tracks by ids
	 */
	async ids(params: JamParameters.Tracks): Promise<Array<Jam.Track>> {
		return this.base.requestData<Array<Jam.Track>>('track/ids', params);
	}

	/**
	 * get an raw tag (eg. id3/vorbis) by track id
	 */
	async rawTag(params: JamParameters.ID): Promise<Jam.RawTag> {
		return this.base.requestData<Jam.RawTag>('track/rawTag', params);
	}

	/**
	 * get raw tags (eg. id3/vorbis) by track ids
	 */
	async rawTags(params: JamParameters.IDs): Promise<Jam.RawTags> {
		return this.base.requestData<Jam.RawTags>('track/rawTags', params);
	}

	/**
	 * search tracks
	 */
	async search(params: JamParameters.TrackSearch): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('track/search', params);
	}

	/**
	 * get the user state (fav/rating) by track id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('track/state', params);
	}

	/**
	 * get the user states (fav/rating) by track ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('track/states', params);
	}

	/**
	 * get a track list by track list type
	 */
	async list(params: JamParameters.TrackList): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('track/list', params);
	}

	/**
	 * get the similar tracks by track id
	 */
	async similar(params: JamParameters.SimilarTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('track/similar', params);
	}

	/**
	 * list of tracks with health issues // Rights needed: admin
	 */
	async health(params: JamParameters.TrackHealth): Promise<Array<Jam.TrackHealth>> {
		return this.base.requestData<Array<Jam.TrackHealth>>('track/health', params);
	}

	/**
	 * search lyrics for the track
	 */
	async lyrics(params: JamParameters.ID): Promise<Jam.TrackLyrics> {
		return this.base.requestData<Jam.TrackLyrics>('track/lyrics', params);
	}

	/**
	 * download track media as binary // Rights needed: stream
	 */
	stream_url(params: JamParameters.Stream): string {
		return this.base.buildRequestUrl('track/stream', params);
	}

	/**
	 * download track media as binary // Rights needed: stream
	 */
	async stream_binary(params: JamParameters.Stream): Promise<ArrayBuffer> {
		return this.base.binary('track/stream', params);
	}

	/**
	 * download track media as binary archive // Rights needed: stream
	 */
	download_url(params: JamParameters.Download): string {
		return this.base.buildRequestUrl('track/download', params);
	}

	/**
	 * download track media as binary archive // Rights needed: stream
	 */
	async download_binary(params: JamParameters.Download): Promise<ArrayBuffer> {
		return this.base.binary('track/download', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('track/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('track/image', params);
	}

	/**
	 * fav/unfav a track
	 */
	async fav_update(params: JamParameters.Fav): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('track/fav/update', params);
	}

	/**
	 * rate a track
	 */
	async rate_update(params: JamParameters.Rate): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('track/rate/update', params);
	}

	/**
	 * write a raw tag to a track // Rights needed: admin
	 */
	async rawTag_update(params: JamParameters.RawTagUpdate): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('track/rawTag/update', params);
	}

	/**
	 * rename a track // Rights needed: admin
	 */
	async name_update(params: JamParameters.TrackEditName): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('track/name/update', params);
	}

	/**
	 * move a track to a new parent folder // Rights needed: admin
	 */
	async parent_update(params: JamParameters.TrackMoveParent): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('track/parent/update', params);
	}

	/**
	 * delete a track // Rights needed: admin
	 */
	async delete(params: JamParameters.ID): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('track/delete', params);
	}

	/**
	 * fix a track by health warning id // Rights needed: admin
	 */
	async fix(params: JamParameters.TrackFix): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('track/fix', params);
	}

}
