import { SectionBase } from 'react-native';
import { JamObjectType, ListType } from '../services/jam';

export interface BaseEntry {
	id: string;
	title: string;
	desc: string;
	objType: JamObjectType;
}

export interface BaseEntryList {
	listType?: ListType;
	items: Array<BaseEntry>;
	total: number;
	skip?: number;
	take?: number;
}

export interface BaseEntrySection extends SectionBase<BaseEntry> {
	title: string;
}
