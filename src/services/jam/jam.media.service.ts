// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamMediaService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * stream a media file in a format // Rights needed: stream
	 */
	stream_url(id: string, format?: JamParameters.AudioFormatType, forDom: boolean = true): string {
		return this.base.buildRequestUrl(`stream/${id}${format !== undefined ? `.${format}` : ''}`, undefined, forDom);
	}

	/**
	 * stream a media file in a format // Rights needed: stream
	 */
	async stream_binary(id: string, format?: JamParameters.AudioFormatType): Promise<ArrayBuffer> {
		return this.base.binary(`stream/${id}${format !== undefined ? `.${format}` : ''}`);
	}

	/**
	 * get peaks waveform data as svg | json | binary // Rights needed: stream
	 */
	waveform_url(id: string, format?: JamParameters.WaveformFormatType, forDom: boolean = true): string {
		return this.base.buildRequestUrl(`waveform/${id}${format !== undefined ? `.${format}` : ''}`, undefined, forDom);
	}

	/**
	 * get peaks waveform data as svg | json | binary // Rights needed: stream
	 */
	async waveform_binary(id: string, format?: JamParameters.WaveformFormatType): Promise<ArrayBuffer> {
		return this.base.binary(`waveform/${id}${format !== undefined ? `.${format}` : ''}`);
	}

	/**
	 * get peaks waveform data as svg with a width // Rights needed: stream
	 */
	waveform_svg_url(id: string, width: number, forDom: boolean = true): string {
		return this.base.buildRequestUrl(`waveform_svg/${id}-${width}.svg`, undefined, forDom);
	}

	/**
	 * get peaks waveform data as svg with a width // Rights needed: stream
	 */
	async waveform_svg_binary(id: string, width: number): Promise<ArrayBuffer> {
		return this.base.binary(`waveform_svg/${id}-${width}.svg`);
	}

	/**
	 * get peaks waveform data as json // Rights needed: stream
	 */
	async waveform_json(params: JamParameters.ID): Promise<Jam.WaveFormData> {
		return this.base.requestData<Jam.WaveFormData>('waveform_json', params);
	}

	/**
	 * download object as binary archive by id // Rights needed: stream
	 */
	download_url(id: string, format?: JamParameters.DownloadFormatType, forDom: boolean = true): string {
		return this.base.buildRequestUrl(`download/${id}${format !== undefined ? `.${format}` : ''}`, undefined, forDom);
	}

	/**
	 * download object as binary archive by id // Rights needed: stream
	 */
	async download_binary(id: string, format?: JamParameters.DownloadFormatType): Promise<ArrayBuffer> {
		return this.base.binary(`download/${id}${format !== undefined ? `.${format}` : ''}`);
	}

	/**
	 * scrobble a media file
	 */
	async stream_scrobble(params: JamParameters.ID): Promise<void> {
		return this.base.requestPostDataOK('stream/scrobble', params);
	}

}
