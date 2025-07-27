// @generated
// This file was automatically generated and should not be edited.

import { JamBaseService } from '../jam.base.service';
import type { Jam } from '../model/jam-rest-data';
import type { JamParameters } from '../model/jam-rest-params';

export class JamTrackService {
	constructor(private readonly base: JamBaseService) {
	}

	/**
	 * Get a Track by Id // Rights needed: stream
	 */
	async id(params: JamParameters.TrackIdArgs): Promise<Jam.Track> {
		return this.base.requestData<Jam.Track>('/track/id', params);
	}

	/**
	 * Search Tracks // Rights needed: stream
	 */
	async search(params: JamParameters.TrackSearchArgs): Promise<Jam.TrackPage> {
		return this.base.requestData<Jam.TrackPage>('/track/search', params);
	}

	/**
	 * Get similar Tracks by Track Id (External Service) // Rights needed: stream
	 */
	async similar(params: JamParameters.TrackSimilarArgs): Promise<Jam.TrackPage> {
		return this.base.requestData<Jam.TrackPage>('/track/similar', params);
	}

	/**
	 * Get Lyrics for a Track by Id (External Service or Media File) // Rights needed: stream
	 */
	async lyrics(params: JamParameters.ID): Promise<Jam.TrackLyrics> {
		return this.base.requestData<Jam.TrackLyrics>('/track/lyrics', params);
	}

	/**
	 * Get Raw Tag (eg. id3/vorbis) // Rights needed: stream
	 */
	async rawTagGet(params: JamParameters.TrackFilterArgs): Promise<Array<Jam.MediaIDTagRaw>> {
		return this.base.requestData<Array<Jam.MediaIDTagRaw>>('/track/rawTag/get', params);
	}

	/**
	 * List of Tracks with Health Issues // Rights needed: stream
	 */
	async health(params: JamParameters.TrackHealthArgs): Promise<Array<Jam.TrackHealth>> {
		return this.base.requestData<Array<Jam.TrackHealth>>('/track/health', params);
	}

	/**
	 * Rename a track // Rights needed: stream
	 */
	async rename(params: JamParameters.TrackRenameArgs): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/track/rename', params);
	}

	/**
	 * Move Tracks // Rights needed: stream
	 */
	async move(params: JamParameters.TrackMoveArgs): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/track/move', params);
	}

	/**
	 * Remove a Track // Rights needed: stream
	 */
	async remove(params: JamParameters.ID): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/track/remove', params);
	}

	/**
	 * Fix Track by Health Hint Id // Rights needed: stream
	 */
	async fix(params: JamParameters.TrackFixArgs): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/track/fix', params);
	}

	/**
	 * Write a Raw Rag to a Track by Track Id // Rights needed: stream
	 */
	async rawTagSet(params: JamParameters.RawTagUpdateArgs): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('/track/rawTag/set', params);
	}
}
