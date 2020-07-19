// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamArtistService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get an Artist by Id // Rights needed: stream
	 */
	async id(params: JamParameters.ArtistIdArgs): Promise<Jam.Artist> {
		return this.base.requestData<Jam.Artist>('/artist/id', params);
	}

	/**
	 * Get the Navigation Index for Albums // Rights needed: stream
	 */
	async index(params: JamParameters.ArtistFilterArgs): Promise<Jam.ArtistIndex> {
		return this.base.requestData<Jam.ArtistIndex>('/artist/index', params);
	}

	/**
	 * Search Artists // Rights needed: stream
	 */
	async search(params: JamParameters.ArtistSearchArgs): Promise<Jam.ArtistPage> {
		return this.base.requestData<Jam.ArtistPage>('/artist/search', params);
	}

	/**
	 * Get Meta Data Info of an Artist by Id (External Service) // Rights needed: stream
	 */
	async info(params: JamParameters.ID): Promise<Jam.ExtendedInfoResult> {
		return this.base.requestData<Jam.ExtendedInfoResult>('/artist/info', params);
	}

	/**
	 * Get similar Artists of an Artist by Id (External Service) // Rights needed: stream
	 */
	async similar(params: JamParameters.ArtistSimilarArgs): Promise<Jam.ArtistPage> {
		return this.base.requestData<Jam.ArtistPage>('/artist/similar', params);
	}

	/**
	 * Get similar Tracks of an Artist by Id (External Service) // Rights needed: stream
	 */
	async similarTracks(params: JamParameters.ArtistSimilarTracksArgs): Promise<Jam.TrackPage> {
		return this.base.requestData<Jam.TrackPage>('/artist/similar/tracks', params);
	}

	/**
	 * Get Tracks of Artists // Rights needed: stream
	 */
	async tracks(params: JamParameters.ArtistTracksArgs): Promise<Jam.TrackPage> {
		return this.base.requestData<Jam.TrackPage>('/artist/tracks', params);
	}

	/**
	 * Get Albums of Artists // Rights needed: stream
	 */
	async albums(params: JamParameters.ArtistAlbumsArgs): Promise<Jam.AlbumPage> {
		return this.base.requestData<Jam.AlbumPage>('/artist/albums', params);
	}

	/**
	 * Get Series of Artists // Rights needed: stream
	 */
	async series(params: JamParameters.ArtistSeriesArgs): Promise<Jam.SeriesPage> {
		return this.base.requestData<Jam.SeriesPage>('/artist/series', params);
	}

}
