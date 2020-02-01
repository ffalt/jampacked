// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamMetadataService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * lookup lastfm data
	 */
	async lastfm_lookup(params: JamParameters.LastFMLookup): Promise<Jam.LastFMResponse> {
		return this.base.requestData<Jam.LastFMResponse>('lastfm/lookup', params);
	}

	/**
	 * search lyrics.ovh data
	 */
	async lyricsovh_search(params: JamParameters.LyricsOVHSearch): Promise<Jam.LyricsOVHResponse> {
		return this.base.requestData<Jam.LyricsOVHResponse>('lyricsovh/search', params);
	}

	/**
	 * lookup acoustid data
	 */
	async acoustid_lookup(params: JamParameters.AcoustidLookup): Promise<Array<Jam.AcoustidResponse>> {
		return this.base.requestData<Array<Jam.AcoustidResponse>>('acoustid/lookup', params);
	}

	/**
	 * lookup musicbrainz data
	 */
	async musicbrainz_lookup(params: JamParameters.MusicBrainzLookup): Promise<Jam.MusicBrainzResponse> {
		return this.base.requestData<Jam.MusicBrainzResponse>('musicbrainz/lookup', params);
	}

	/**
	 * search musicbrainz data
	 */
	async musicbrainz_search(params: JamParameters.MusicBrainzSearch): Promise<Jam.MusicBrainzResponse> {
		return this.base.requestData<Jam.MusicBrainzResponse>('musicbrainz/search', params);
	}

	/**
	 * lookup acousticbrainz data
	 */
	async acousticbrainz_lookup(params: JamParameters.AcousticBrainzLookup): Promise<Jam.AcousticBrainzResponse> {
		return this.base.requestData<Jam.AcousticBrainzResponse>('acousticbrainz/lookup', params);
	}

	/**
	 * lookup coverartarchive data
	 */
	async coverartarchive_lookup(params: JamParameters.CoverArtArchiveLookup): Promise<Jam.CoverArtArchiveResponse> {
		return this.base.requestData<Jam.CoverArtArchiveResponse>('coverartarchive/lookup', params);
	}

	/**
	 * wikipedia summary
	 */
	async wikipedia_summary(params: JamParameters.WikipediaSummary): Promise<Jam.WikipediaSummaryResponse> {
		return this.base.requestData<Jam.WikipediaSummaryResponse>('wikipedia/summary', params);
	}

	/**
	 * wikidata summary
	 */
	async wikidata_summary(params: JamParameters.WikidataSummary): Promise<Jam.WikipediaSummaryResponse> {
		return this.base.requestData<Jam.WikipediaSummaryResponse>('wikidata/summary', params);
	}

	/**
	 * wikidata lookup
	 */
	async wikidata_lookup(params: JamParameters.WikidataLookup): Promise<Jam.WikidataLookupResponse> {
		return this.base.requestData<Jam.WikidataLookupResponse>('wikidata/lookup', params);
	}

}
