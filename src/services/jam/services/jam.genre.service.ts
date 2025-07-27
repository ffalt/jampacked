// @generated
// This file was automatically generated and should not be edited.

import { JamBaseService } from '../jam.base.service';
import type { Jam } from '../model/jam-rest-data';
import type { JamParameters } from '../model/jam-rest-params';

export class JamGenreService {
	constructor(private readonly base: JamBaseService) {
	}

	/**
	 * Get a Genre by Id // Rights needed: stream
	 */
	async id(params: JamParameters.GenreIdArgs): Promise<Jam.Genre> {
		return this.base.requestData<Jam.Genre>('/genre/id', params);
	}

	/**
	 * Search Genres // Rights needed: stream
	 */
	async search(params: JamParameters.GenreSearchArgs): Promise<Jam.GenrePage> {
		return this.base.requestData<Jam.GenrePage>('/genre/search', params);
	}

	/**
	 * Get the Navigation Index for Genres // Rights needed: stream
	 */
	async index(params: JamParameters.GenreFilterArgs): Promise<Jam.GenreIndex> {
		return this.base.requestData<Jam.GenreIndex>('/genre/index', params);
	}

	/**
	 * Get Tracks of Genres // Rights needed: stream
	 */
	async tracks(params: JamParameters.GenreTracksArgs): Promise<Jam.TrackPage> {
		return this.base.requestData<Jam.TrackPage>('/genre/tracks', params);
	}

	/**
	 * Get Albums of Genres // Rights needed: stream
	 */
	async albums(params: JamParameters.GenreAlbumsArgs): Promise<Jam.AlbumPage> {
		return this.base.requestData<Jam.AlbumPage>('/genre/albums', params);
	}

	/**
	 * Get Artists of Genres // Rights needed: stream
	 */
	async artists(params: JamParameters.GenreArtistsArgs): Promise<Jam.ArtistPage> {
		return this.base.requestData<Jam.ArtistPage>('/genre/artists', params);
	}
}
