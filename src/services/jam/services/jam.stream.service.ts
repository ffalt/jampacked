// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {JamParameters} from '../model/jam-rest-params';

export class JamStreamService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Stream a media file in a format [Episode, Track] // Rights needed: stream
	 */
	streamUrl(params: JamParameters.StreamStreamArgs, forDom: boolean): string {
		if (!params.id) { return ''; }
		return this.base.buildRequestUrl(`/stream/${params.id}${params.maxBitRate ? `_${params.maxBitRate}` : ''}${params.format ? `.${params.format}` : ''}`, {}, forDom);
	}

	/**
	 * Stream a media file in a format [Episode, Track] // Rights needed: stream
	 */
	async streamBinary(params: JamParameters.StreamStreamArgs): Promise<{buffer: ArrayBuffer; contentType: string}> {
		if (!params.id) { throw new Error('Invalid Parameter'); }
		return this.base.binary(`/stream/${params.id}${params.maxBitRate ? `_${params.maxBitRate}` : ''}${params.format ? `.${params.format}` : ''}`, {});
	}

}
