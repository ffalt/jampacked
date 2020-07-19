// @generated
// This file was automatically generated and should not be edited.

import {JamBaseService} from '../jam.base.service';
import {Jam} from '../model/jam-rest-data';
import {JamParameters} from '../model/jam-rest-params';

export class JamAutocompleteService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * Get compact Search Results for Autocomplete Features // Rights needed: stream
	 */
	async autocomplete(params: JamParameters.AutoCompleteFilterArgs): Promise<Jam.AutoComplete> {
		return this.base.requestData<Jam.AutoComplete>('/autocomplete', params);
	}

}
