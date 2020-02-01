// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamPodcastService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a podcast by id
	 */
	async id(params: JamParameters.Podcast): Promise<Jam.Podcast> {
		return this.base.requestData<Jam.Podcast>('podcast/id', params);
	}

	/**
	 * get podcasts by ids
	 */
	async ids(params: JamParameters.Podcasts): Promise<Array<Jam.Podcast>> {
		return this.base.requestData<Array<Jam.Podcast>>('podcast/ids', params);
	}

	/**
	 * get the podcast state (e.g. downloading, new, etc.) by podcast id
	 */
	async status(params: JamParameters.ID): Promise<Jam.PodcastStatus> {
		return this.base.requestData<Jam.PodcastStatus>('podcast/status', params);
	}

	/**
	 * search podcasts
	 */
	async search(params: JamParameters.PodcastSearch): Promise<Jam.PodcastList> {
		return this.base.requestData<Jam.PodcastList>('podcast/search', params);
	}

	/**
	 * get podcast episodes by podcast id
	 */
	async episodes(params: JamParameters.PodcastEpisodes): Promise<Jam.PodcastEpisodeList> {
		return this.base.requestData<Jam.PodcastEpisodeList>('podcast/episodes', params);
	}

	/**
	 * check all podcast feeds for new episodes // Rights needed: podcast
	 */
	async refreshAll(): Promise<void> {
		return this.base.requestOK('podcast/refreshAll', {});
	}

	/**
	 * check podcast feeds for new episodes by podcast id // Rights needed: podcast
	 */
	async refresh(params: JamParameters.ID): Promise<void> {
		return this.base.requestOK('podcast/refresh', params);
	}

	/**
	 * get the user state (fav/rating) by podcast id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('podcast/state', params);
	}

	/**
	 * get the user states (fav/rating) by podcast ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('podcast/states', params);
	}

	/**
	 * get a list of podcasts by list type
	 */
	async list(params: JamParameters.PodcastList): Promise<Jam.PodcastList> {
		return this.base.requestData<Jam.PodcastList>('podcast/list', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('podcast/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('podcast/image', params);
	}

	/**
	 * download podcast episodes as binary archive // Rights needed: stream
	 */
	download_url(params: JamParameters.Download): string {
		return this.base.buildRequestUrl('podcast/download', params);
	}

	/**
	 * download podcast episodes as binary archive // Rights needed: stream
	 */
	async download_binary(params: JamParameters.Download): Promise<ArrayBuffer> {
		return this.base.binary('podcast/download', params);
	}

	/**
	 * create a podcast // Rights needed: podcast
	 */
	async create(params: JamParameters.PodcastNew): Promise<Jam.Podcast> {
		return this.base.requestPostData<Jam.Podcast>('podcast/create', params);
	}

	/**
	 * fav/unfav a podcast
	 */
	async fav_update(params: JamParameters.Fav): Promise<void> {
		return this.base.requestPostDataOK('podcast/fav/update', params);
	}

	/**
	 * rate a podcast
	 */
	async rate_update(params: JamParameters.Rate): Promise<void> {
		return this.base.requestPostDataOK('podcast/rate/update', params);
	}

	/**
	 * delete a podcast // Rights needed: podcast
	 */
	async delete(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('podcast/delete', params);
	}

}
