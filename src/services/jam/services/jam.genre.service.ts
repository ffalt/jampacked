// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamGenreService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get a list of genres found in the library // Rights needed: stream
	 */
	async list(params: JamParameters.GenreListArgs): Promise<Jam.GenrePage> {
		return this.base.requestData<Jam.GenrePage>('/genre/list', params);
	}

	/**
	 * Get the Navigation Index for Genres // Rights needed: stream
	 */
	async index(): Promise<Jam.GenreIndex> {
		return this.base.requestData<Jam.GenreIndex>('/genre/index', {});
	}

}
