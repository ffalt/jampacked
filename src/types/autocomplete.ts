import { SectionListData } from 'react-native';
import { Jam, JamObjectType } from '../services/jam';

export interface AutoCompleteEntryData extends Jam.AutoCompleteEntry {
	objType: JamObjectType;
}

export interface AutoCompleteDataSection extends SectionListData<AutoCompleteEntryData> {
	objType: JamObjectType;
	total: number;
}

export type AutoCompleteData = Array<AutoCompleteDataSection>;
