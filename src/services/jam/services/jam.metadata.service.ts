// @generated
// This file was automatically generated and should not be edited.

import { JamBaseService } from '../jam.base.service';
import type { Jam } from '../model/jam-rest-data';
import type { JamParameters } from '../model/jam-rest-params';

export class JamMetaDataService {
	constructor(private readonly base: JamBaseService) {
	}

	/**
	 * Lookup LastFM data // Rights needed: stream
	 */
	async lastfmLookup(params: JamParameters.LastFMLookupParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/lastfm/lookup', params);
	}

	/**
	 * Search Lyrics.ovh data // Rights needed: stream
	 */
	async lyricsovhSearch(params: JamParameters.LyricsOVHSearchParameters): Promise<Jam.MetaDataTrackLyricsResult> {
		return this.base.requestData<Jam.MetaDataTrackLyricsResult>('/metadata/lyricsovh/search', params);
	}

	/**
	 * Get Lrclib.net data // Rights needed: stream
	 */
	async lcrlibSearch(params: JamParameters.LrclibSearchParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/lrclib/get', params);
	}

	/**
	 * Lookup AcoustId data // Rights needed: stream
	 */
	async acoustidLookup(params: JamParameters.AcoustidLookupParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/acoustid/lookup', params);
	}

	/**
	 * Lookup MusicBrainz data // Rights needed: stream
	 */
	async musicbrainzLookup(params: JamParameters.MusicBrainzLookupParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/musicbrainz/lookup', params);
	}

	/**
	 * Search MusicBrainz data // Rights needed: stream
	 */
	async musicbrainzSearch(params: JamParameters.MusicBrainzSearchParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/musicbrainz/search', params);
	}

	/**
	 * Lookup AcousticBrainz data // Rights needed: stream
	 */
	async acousticbrainzLookup(params: JamParameters.AcousticBrainzLookupParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/acousticbrainz/lookup', params);
	}

	/**
	 * Lookup CoverArtArchive data // Rights needed: stream
	 */
	async coverartarchiveLookup(params: JamParameters.CoverArtArchiveLookupParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/coverartarchive/lookup', params);
	}

	/**
	 * Get CoverArtArchive image // Rights needed: stream
	 */
	coverartarchiveImageUrl(params: JamParameters.CoverArtArchiveImageParameters, forDom: boolean): string {
		return this.base.buildRequestUrl('/metadata/coverartarchive/image', params, forDom);
	}

	/**
	 * Get CoverArtArchive image // Rights needed: stream
	 */
	async coverartarchiveImageBinary(params: JamParameters.CoverArtArchiveImageParameters): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		return this.base.binary('/metadata/coverartarchive/image', params);
	}

	/**
	 * Search Wikipedia Summary data // Rights needed: stream
	 */
	async wikipediaSummarySearch(params: JamParameters.WikipediaSummaryParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/wikipedia/summary', params);
	}

	/**
	 * Search WikiData summary data // Rights needed: stream
	 */
	async wikidataSummarySearch(params: JamParameters.WikidataSummaryParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/wikidata/summary', params);
	}

	/**
	 * Lookup WikiData summary data // Rights needed: stream
	 */
	async wikidataLookup(params: JamParameters.WikidataLookupParameters): Promise<Jam.MetaDataResult> {
		return this.base.requestData<Jam.MetaDataResult>('/metadata/wikidata/lookup', params);
	}
}
