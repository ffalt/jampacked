import {HomeStatsData} from '../types';
import {AlbumType, ListType} from '../jam';
import {JamRouteLinks} from '../../navigators/Routes';
import {DocumentNode} from 'graphql';
import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {useCallback} from 'react';
import {UserResultDocument, UserResultQuery, UserResultQueryVariables} from './user.api';

export interface UserDataResult {
	stats: HomeStatsData;
	favorites: HomeStatsData;
	played: HomeStatsData;
}

export type UserResult_currentUser_stats = NonNullable<UserResultQuery>['currentUser']['stats'];
export type UserResult_currentUser_stats_favorite = NonNullable<UserResult_currentUser_stats>['favorite'];
export type UserResult_currentUser_stats_played = NonNullable<UserResult_currentUser_stats>['played'];

function transformSectionStats(stats: UserResult_currentUser_stats_played | UserResult_currentUser_stats_favorite, listType: ListType): HomeStatsData {
	return [
		{link: JamRouteLinks.artistlist(listType), value: stats.artistTypes.album},
		{link: JamRouteLinks.albumlist(listType, AlbumType.album), value: stats.albumTypes.album},
		{link: JamRouteLinks.albumlist(listType, AlbumType.compilation), value: stats.albumTypes.compilation},
		{link: JamRouteLinks.serieslist(listType), value: stats.series},
		{link: JamRouteLinks.albumlist(listType, AlbumType.audiobook), value: stats.albumTypes.audiobook},
		{link: JamRouteLinks.albumlist(listType, AlbumType.soundtrack), value: stats.albumTypes.soundtrack},
		{link: JamRouteLinks.albumlist(listType, AlbumType.live), value: stats.albumTypes.live},
		{link: JamRouteLinks.albumlist(listType, AlbumType.bootleg), value: stats.albumTypes.bootleg},
		{link: JamRouteLinks.albumlist(listType, AlbumType.ep), value: stats.albumTypes.ep},
		{link: JamRouteLinks.albumlist(listType, AlbumType.single), value: stats.albumTypes.single},
		{link: JamRouteLinks.folderlist(listType), value: stats.folder},
		{link: JamRouteLinks.tracklist(listType), value: stats.track}
	].filter(t => t.value > 0);
}

function transformData(data?: UserResultQuery): UserDataResult | undefined {
	if (!data?.currentUser) {
		return;
	}
	const stats = data.currentUser.stats;
	const base: HomeStatsData = [
		{link: JamRouteLinks.bookmarks(), value: stats.bookmark},
		{link: JamRouteLinks.playlists(), value: stats.playlist}
	].filter(t => t.value !== undefined);
	const favorites: HomeStatsData = transformSectionStats(stats.favorite, ListType.faved);
	const played: HomeStatsData = transformSectionStats(stats.played, ListType.recent);
	return {stats: base, favorites, played};
}

function transformVariables(): UserResultQueryVariables {
	return {};
}

export const UserQuery: {
	query: DocumentNode;
	transformData: (d?: UserResultQuery, variables?: UserResultQueryVariables) => UserDataResult | undefined;
	transformVariables: (id: string) => UserResultQueryVariables;
} = {query: UserResultDocument, transformData, transformVariables};


export const useLazyUserDataQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, userData?: UserDataResult, called: boolean }
] => {
	const [query, {loading, error, data, called}] =
		useCacheOrLazyQuery<UserResultQuery, UserResultQueryVariables, UserDataResult>(UserQuery.query, UserQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, userData: data}];
};
