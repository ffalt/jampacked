// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamPodcastService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get a Podcast by Id // Rights needed: stream
	 */
	async id(params: JamParameters.PodcastIdArgs): Promise<Jam.Podcast> {
		return this.base.requestData<Jam.Podcast>('/podcast/id', params);
	}

	/**
	 * Get the Navigation Index for Podcasts // Rights needed: stream
	 */
	async index(params: JamParameters.PodcastFilterArgs): Promise<Jam.PodcastIndex> {
		return this.base.requestData<Jam.PodcastIndex>('/podcast/index', params);
	}

	/**
	 * Search Podcasts // Rights needed: stream
	 */
	async search(params: JamParameters.PodcastSearchArgs): Promise<Jam.PodcastPage> {
		return this.base.requestData<Jam.PodcastPage>('/podcast/search', params);
	}

	/**
	 * Get Episodes of Podcasts // Rights needed: stream
	 */
	async episodes(params: JamParameters.PodcastEpisodesArgs): Promise<Jam.EpisodePage> {
		return this.base.requestData<Jam.EpisodePage>('/podcast/episodes', params);
	}

	/**
	 * Get a Podcast Status by Podcast Id // Rights needed: stream
	 */
	async status(params: JamParameters.ID): Promise<Jam.PodcastUpdateStatus> {
		return this.base.requestData<Jam.PodcastUpdateStatus>('/podcast/status', params);
	}

	/**
	 * Create a Podcast // Rights needed: stream
	 */
	async create(params: JamParameters.PodcastCreateArgs): Promise<Jam.Podcast> {
		return this.base.requestPostData<Jam.Podcast>('/podcast/create', params);
	}

	/**
	 * Check Podcast Feeds for new Episodes // Rights needed: stream
	 */
	async refresh(params: JamParameters.PodcastRefreshArgs): Promise<void> {
		return this.base.requestPostDataOK('/podcast/refresh', params);
	}

	/**
	 * Remove a Podcast // Rights needed: stream
	 */
	async remove(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('/podcast/remove', params);
	}

}
