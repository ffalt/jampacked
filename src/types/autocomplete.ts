import { SectionBase } from 'react-native';
import { Jam, JamObjectType } from '../services/jam';

export interface AutoCompleteEntryData extends Jam.AutoCompleteEntry {
	objType: JamObjectType;
}

export interface AutoCompleteDataSection extends SectionBase<AutoCompleteEntryData> {
	objType: JamObjectType;
	total: number;
}

export type AutoCompleteData = Array<AutoCompleteDataSection>;
