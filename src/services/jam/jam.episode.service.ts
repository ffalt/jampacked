// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamEpisodeService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a podcast episode by id
	 */
	async id(params: JamParameters.Episode): Promise<Jam.PodcastEpisode> {
		return this.base.requestData<Jam.PodcastEpisode>('episode/id', params);
	}

	/**
	 * get podcast episodes by ids
	 */
	async ids(params: JamParameters.Episodes): Promise<Array<Jam.PodcastEpisode>> {
		return this.base.requestData<Array<Jam.PodcastEpisode>>('episode/ids', params);
	}

	/**
	 * search podcast episodes
	 */
	async search(params: JamParameters.EpisodeSearch): Promise<Jam.PodcastEpisodeList> {
		return this.base.requestData<Jam.PodcastEpisodeList>('episode/search', params);
	}

	/**
	 * retrieve a podcast episode media file // Rights needed: podcast
	 */
	async retrieve(params: JamParameters.ID): Promise<void> {
		return this.base.requestOK('episode/retrieve', params);
	}

	/**
	 * get the user state (fav/rating) by podcast episode id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('episode/state', params);
	}

	/**
	 * get the user states (fav/rating) by podcast episode ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('episode/states', params);
	}

	/**
	 * get the episode state (e.g. downloading, new, etc.) by podcast episode id
	 */
	async status(params: JamParameters.ID): Promise<Jam.PodcastEpisodeStatus> {
		return this.base.requestData<Jam.PodcastEpisodeStatus>('episode/status', params);
	}

	/**
	 * get a list of episodes by list type
	 */
	async list(params: JamParameters.PodcastEpisodeList): Promise<Jam.PodcastEpisodeList> {
		return this.base.requestData<Jam.PodcastEpisodeList>('episode/list', params);
	}

	/**
	 * download episode media as binary // Rights needed: stream
	 */
	stream_url(params: JamParameters.Stream): string {
		return this.base.buildRequestUrl('episode/stream', params);
	}

	/**
	 * download episode media as binary // Rights needed: stream
	 */
	async stream_binary(params: JamParameters.Stream): Promise<ArrayBuffer> {
		return this.base.binary('episode/stream', params);
	}

	/**
	 * download episode media as binary archive // Rights needed: stream
	 */
	download_url(params: JamParameters.Download): string {
		return this.base.buildRequestUrl('episode/download', params);
	}

	/**
	 * download episode media as binary archive // Rights needed: stream
	 */
	async download_binary(params: JamParameters.Download): Promise<ArrayBuffer> {
		return this.base.binary('episode/download', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('episode/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('episode/image', params);
	}

	/**
	 * fav/unfav an episode
	 */
	async fav_update(params: JamParameters.Fav): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('episode/fav/update', params);
	}

	/**
	 * rate an episode
	 */
	async rate_update(params: JamParameters.Rate): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('episode/rate/update', params);
	}

}
