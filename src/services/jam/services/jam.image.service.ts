// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {JamParameters} from '../model/jam-rest-params';

export class JamImageService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Image Binary [Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track, User] // Rights needed: stream
	 */
	imageUrl(params: JamParameters.ImageArgs, forDom: boolean): string {
		if (!params.id) { return ''; }
		return this.base.buildRequestUrl(`/image/${params.id}${params.size ? `_${params.size}` : ''}${params.format ? `.${params.format}` : ''}`, {}, forDom);
	}

	/**
	 * Image Binary [Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track, User] // Rights needed: stream
	 */
	async imageBinary(params: JamParameters.ImageArgs): Promise<ArrayBuffer> {
		if (!params.id) { throw new Error('Invalid Parameter'); }
		return this.base.binary(`/image/${params.id}${params.size ? `_${params.size}` : ''}${params.format ? `.${params.format}` : ''}`, {});
	}

}
