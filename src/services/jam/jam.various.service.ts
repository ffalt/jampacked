// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamVariousService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * autocomplete
	 */
	async autocomplete(params: JamParameters.AutoComplete): Promise<Jam.AutoComplete> {
		return this.base.requestData<Jam.AutoComplete>('autocomplete', params);
	}

	/**
	 * get list of genres found in the library
	 */
	async genre_list(params: JamParameters.Genres): Promise<Jam.GenreList> {
		return this.base.requestData<Jam.GenreList>('genre/list', params);
	}

	/**
	 * get count stats for folders/tracks/albums/...
	 */
	async stats(params: JamParameters.Stats): Promise<Jam.Stats> {
		return this.base.requestData<Jam.Stats>('stats', params);
	}

	/**
	 * get list of tracks played by all users
	 */
	async nowPlaying_list(params: JamParameters.NowPlaying): Promise<Jam.NowPlayingList> {
		return this.base.requestData<Jam.NowPlayingList>('nowPlaying/list', params);
	}

}
