// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamArtistService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get an artist by id
	 */
	async id(params: JamParameters.Artist): Promise<Jam.Artist> {
		return this.base.requestData<Jam.Artist>('artist/id', params);
	}

	/**
	 * get artists by ids
	 */
	async ids(params: JamParameters.Artists): Promise<Array<Jam.Artist>> {
		return this.base.requestData<Array<Jam.Artist>>('artist/ids', params);
	}

	/**
	 * search artists
	 */
	async search(params: JamParameters.ArtistSearch): Promise<Jam.ArtistList> {
		return this.base.requestData<Jam.ArtistList>('artist/search', params);
	}

	/**
	 * get the user state (fav/rating) by artist id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('artist/state', params);
	}

	/**
	 * get the user states (fav/rating) by artist ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('artist/states', params);
	}

	/**
	 * get a artist list by artist list type
	 */
	async list(params: JamParameters.ArtistList): Promise<Jam.ArtistList> {
		return this.base.requestData<Jam.ArtistList>('artist/list', params);
	}

	/**
	 * get similar tracks of an artist by artist id
	 */
	async similar_tracks(params: JamParameters.SimilarTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('artist/similar/tracks', params);
	}

	/**
	 * get similar artists of an artist by artist id
	 */
	async similar(params: JamParameters.SimilarArtists): Promise<Jam.ArtistList> {
		return this.base.requestData<Jam.ArtistList>('artist/similar', params);
	}

	/**
	 * get the navigation index for artists
	 */
	async index(params: JamParameters.ArtistIndex): Promise<Jam.ArtistIndex> {
		return this.base.requestData<Jam.ArtistIndex>('artist/index', params);
	}

	/**
	 * get tracks of an artist by artist id
	 */
	async tracks(params: JamParameters.ArtistTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('artist/tracks', params);
	}

	/**
	 * get albums of an artist by artist id
	 */
	async albums(params: JamParameters.ArtistAlbums): Promise<Jam.AlbumList> {
		return this.base.requestData<Jam.AlbumList>('artist/albums', params);
	}

	/**
	 * get series of an artist by artist id
	 */
	async series(params: JamParameters.ArtistSeries): Promise<Jam.SeriesList> {
		return this.base.requestData<Jam.SeriesList>('artist/series', params);
	}

	/**
	 * get external artist description by id
	 */
	async info(params: JamParameters.ID): Promise<Jam.Info> {
		return this.base.requestData<Jam.Info>('artist/info', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('artist/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('artist/image', params);
	}

	/**
	 * download artist tracks as binary archive // Rights needed: stream
	 */
	download_url(params: JamParameters.Download): string {
		return this.base.buildRequestUrl('artist/download', params);
	}

	/**
	 * download artist tracks as binary archive // Rights needed: stream
	 */
	async download_binary(params: JamParameters.Download): Promise<ArrayBuffer> {
		return this.base.binary('artist/download', params);
	}

	/**
	 * fav/unfav an artist
	 */
	async fav_update(params: JamParameters.Fav): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('artist/fav/update', params);
	}

	/**
	 * rate an artist
	 */
	async rate_update(params: JamParameters.Rate): Promise<Jam.State> {
		return this.base.requestPostData<Jam.State>('artist/rate/update', params);
	}

}
