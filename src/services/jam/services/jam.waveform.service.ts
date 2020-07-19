// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamWaveformService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get Peaks Waveform Data as JSON [Episode, Track] // Rights needed: stream
	 */
	async json(params: JamParameters.ID): Promise<Jam.WaveFormData> {
		return this.base.requestData<Jam.WaveFormData>('/waveform/json', params);
	}

	/**
	 * Get Peaks Waveform Data as SVG [Episode, Track] // Rights needed: stream
	 */
	async svg(params: JamParameters.WaveformSVGArgs): Promise<string> {
		return this.base.requestData<string>('/waveform/svg', params);
	}

	/**
	 * Get Peaks Waveform Data [Episode, Track] // Rights needed: stream
	 */
	waveformUrl(params: JamParameters.WaveformWaveformArgs, forDom: boolean): string {
		if (!params.id) { return ''; }
		return this.base.buildRequestUrl(`/waveform/${params.id}${params.width ? `_${params.width}` : ''}${params.format ? `.${params.format}` : ''}`, {}, forDom);
	}

	/**
	 * Get Peaks Waveform Data [Episode, Track] // Rights needed: stream
	 */
	async waveformBinary(params: JamParameters.WaveformWaveformArgs): Promise<ArrayBuffer> {
		if (!params.id) { throw new Error('Invalid Parameter'); }
		return this.base.binary(`/waveform/${params.id}${params.width ? `_${params.width}` : ''}${params.format ? `.${params.format}` : ''}`, {});
	}

}
