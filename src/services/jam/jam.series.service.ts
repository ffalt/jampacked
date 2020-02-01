// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamSeriesService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get a series by id
	 */
	async id(params: JamParameters.Series): Promise<Jam.Series> {
		return this.base.requestData<Jam.Series>('series/id', params);
	}

	/**
	 * get series by ids
	 */
	async ids(params: JamParameters.Serieses): Promise<Array<Jam.Series>> {
		return this.base.requestData<Array<Jam.Series>>('series/ids', params);
	}

	/**
	 * search series
	 */
	async search(params: JamParameters.SeriesSearch): Promise<Jam.SeriesList> {
		return this.base.requestData<Jam.SeriesList>('series/search', params);
	}

	/**
	 * get the user state (fav/rating) by series id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('series/state', params);
	}

	/**
	 * get the user states (fav/rating) by series ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('series/states', params);
	}

	/**
	 * get a series list by series list type
	 */
	async list(params: JamParameters.SeriesList): Promise<Jam.SeriesList> {
		return this.base.requestData<Jam.SeriesList>('series/list', params);
	}

	/**
	 * get the navigation index for series
	 */
	async index(params: JamParameters.SeriesIndex): Promise<Jam.SeriesIndex> {
		return this.base.requestData<Jam.SeriesIndex>('series/index', params);
	}

	/**
	 * get tracks of a series by series id
	 */
	async tracks(params: JamParameters.SeriesTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('series/tracks', params);
	}

	/**
	 * get albums of a series by series id
	 */
	async albums(params: JamParameters.SeriesAlbums): Promise<Jam.AlbumList> {
		return this.base.requestData<Jam.AlbumList>('series/albums', params);
	}

	/**
	 * get external series description by id
	 */
	async info(params: JamParameters.ID): Promise<Jam.Info> {
		return this.base.requestData<Jam.Info>('series/info', params);
	}

	/**
	 * fav/unfav a series
	 */
	async fav_update(params: JamParameters.Fav): Promise<void> {
		return this.base.requestPostDataOK('series/fav/update', params);
	}

	/**
	 * rate a series
	 */
	async rate_update(params: JamParameters.Rate): Promise<void> {
		return this.base.requestPostDataOK('series/rate/update', params);
	}

}
