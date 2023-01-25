import {SectionListData} from 'react-native';
import {AlbumType, Jam, JamObjectType, ListType} from './jam';
import {ApolloError} from '@apollo/client';
import {RouteLink} from '../navigators/Routes';

export interface NavigParams {
	id?: string;
	name?: string;
	albumType?: AlbumType;
	listType?: string;
}

export interface Navig {
	route: string;
	params?: NavigParams;
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

export type HomeStatData = { link: RouteLink, value: number };

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

export type BaseEntryList = {
	listType?: ListType;
	items: Array<BaseEntry>;
	total: number;
	skip?: number;
	take?: number;
};

export type TrackEntryList = {
	listType?: ListType;
	items: Array<TrackEntry>;
	total: number;
	skip?: number;
	take?: number;
};

export type UseListCallFunctionTransform<T> = (
	albumTypes: Array<AlbumType>,
	listType: ListType | undefined,
	genreIDs: Array<string>,
	seed: string | undefined,
	take: number,
	skip: number,
	forceRefresh?: boolean) => T;

export type UseListCallFunction = (
	albumTypes: Array<AlbumType>,
	listType: ListType | undefined,
	genreIDs: Array<string>,
	seed: string | undefined,
	take: number,
	skip: number,
	forceRefresh?: boolean) => void;
export type useListFunction = () => [
	UseListCallFunction,
	{ loading: boolean, error?: ApolloError, data?: BaseEntryList, called: boolean, queryID?: string }
];
export type UseTrackListCallFunction = (listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean) => void;
export type useTrackListFunction = () => [
	UseTrackListCallFunction,
	{ loading: boolean, error?: ApolloError, data?: TrackEntryList, called: boolean, queryID?: string }
];

export interface PinMedia {
	id: string;
	name: string;
	objType: JamObjectType;
	tracks: Array<TrackEntry>;
}

export interface PinState {
	active: boolean;
	pinned: boolean;
}

export interface PinCacheStat {
	files: number;
	size: number;
	humanSize: string;
}
