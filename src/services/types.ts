import {SectionListData} from 'react-native';
import {Jam, JamObjectType} from './jam';

export interface Navig {
	route: string;
	params?: {
		id?: string;
		name?: string;
		albumTypeID?: string;
	};
}

export interface HomeEntry {
	id: string;
	name: string;
	route: string;
}

export interface HomeData {
	artistsRecent?: Array<HomeEntry>;
	artistsFaved?: Array<HomeEntry>;
	albumsFaved?: Array<HomeEntry>;
	albumsRecent?: Array<HomeEntry>;
}

export interface Doc<T> {
	key: string;
	version: number;
	date: number;
	data: T;
}

export interface BaseEntry {
	id: string;
	title: string;
	desc: string;
	objType: JamObjectType;
}

export interface IndexEntry extends BaseEntry {
	letter: string;
}

export interface TrackEntry {
	id: string;
	duration: string;
	durationMS: number;
	trackNr: string;
	title: string;
	artist: string;
	album: string;
	podcastID?: string;
	seriesID?: string;
	albumID?: string;
	artistID?: string;
	genre?: string;
}

export interface AutoCompleteEntryData extends Jam.AutoCompleteEntry {
	objType: JamObjectType;
}

export type Index = Array<IndexEntry>;

export type HomeStatData = { text: string, link: Navig, value: number };

export type HomeStatsData = Array<HomeStatData>;

export interface AutoCompleteDataSection extends SectionListData<AutoCompleteEntryData> {
	objType: JamObjectType;
	total: number;
}

export type AutoCompleteData = Array<AutoCompleteDataSection>;

export type SearchResultData = {
	query: string;
	total: number;
	skip?: number;
	entries: Array<BaseEntry>;
};