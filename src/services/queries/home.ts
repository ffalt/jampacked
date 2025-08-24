import { HomeData, HomeStatsData } from '../types';
import { HomeRoute } from '../../navigators/Routing';
import { AlbumType, ListType } from '../jam';
import { JamRouteLinks } from '../../navigators/Routes';
import { DocumentNode } from 'graphql';
import type { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { HomeResultDocument, HomeResultQuery } from './home.api';

export interface UserDataResult {
	stats: HomeStatsData;
	favorites: HomeStatsData;
	played: HomeStatsData;
}

export interface HomeDataResult {
	stats: HomeStatsData;
	homeData: HomeData;
	user: UserDataResult;
}

export type UserResult = NonNullable<HomeResultQuery>['currentUser'];
export type UserResult_stats = NonNullable<UserResult>['stats'];
export type UserResult_stats_favorite = NonNullable<UserResult_stats>['favorite'];
export type UserResult_stats_played = NonNullable<UserResult_stats>['played'];

function transformSectionStats(stats: UserResult_stats_played | UserResult_stats_favorite, listType: ListType): HomeStatsData {
	return [
		{ link: JamRouteLinks.artistlist(listType), value: stats.artistTypes.album },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.album), value: stats.albumTypes.album },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.compilation), value: stats.albumTypes.compilation },
		{ link: JamRouteLinks.serieslist(listType), value: stats.series },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.audiobook), value: stats.albumTypes.audiobook },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.soundtrack), value: stats.albumTypes.soundtrack },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.live), value: stats.albumTypes.live },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.bootleg), value: stats.albumTypes.bootleg },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.ep), value: stats.albumTypes.ep },
		{ link: JamRouteLinks.albumlist(listType, AlbumType.single), value: stats.albumTypes.single },
		{ link: JamRouteLinks.folderlist(listType), value: stats.folder },
		{ link: JamRouteLinks.tracklist(listType), value: stats.track }
	].filter(t => t.value > 0);
}

function transformUserData(currentUser: UserResult): UserDataResult {
	const stats = currentUser.stats;
	const base: HomeStatsData = [
		{ link: JamRouteLinks.bookmarks(), value: stats.bookmark },
		{ link: JamRouteLinks.playlists(), value: stats.playlist }
	].filter(t => t.value !== undefined);
	const favorites: HomeStatsData = transformSectionStats(stats.favorite, ListType.faved);
	const played: HomeStatsData = transformSectionStats(stats.played, ListType.recent);
	return { stats: base, favorites, played };
}

function transformData(data?: HomeResultQuery): HomeDataResult | undefined {
	if (!data) {
		return;
	}
	const homeData: HomeData = {
		artistsRecent: (data.artistsRecent?.items || []).map(o => ({ ...o, route: HomeRoute.ARTIST })),
		artistsFaved: (data.artistsFaved?.items || []).map(o => ({ ...o, route: HomeRoute.ARTIST })),
		albumsFaved: (data.albumsFaved?.items || []).map(o => ({ ...o, route: HomeRoute.ALBUM })),
		albumsRecent: (data.albumsRecent?.items || []).map(o => ({ ...o, route: HomeRoute.ALBUM }))
	};
	const stats: HomeStatsData = [
		{ link: JamRouteLinks.artists(), value: data.stats.artistTypes.album },
		{ link: JamRouteLinks.albums(AlbumType.album), value: data.stats.albumTypes.album },
		{ link: JamRouteLinks.albums(AlbumType.compilation), value: data.stats.albumTypes.compilation },
		{ link: JamRouteLinks.series(), value: data.stats.series },
		{ link: JamRouteLinks.albums(AlbumType.audiobook), value: data.stats.albumTypes.audiobook },
		{ link: JamRouteLinks.albums(AlbumType.soundtrack), value: data.stats.albumTypes.soundtrack },
		{ link: JamRouteLinks.albums(AlbumType.live), value: data.stats.albumTypes.live },
		{ link: JamRouteLinks.albums(AlbumType.bootleg), value: data.stats.albumTypes.bootleg },
		{ link: JamRouteLinks.albums(AlbumType.ep), value: data.stats.albumTypes.ep },
		{ link: JamRouteLinks.albums(AlbumType.single), value: data.stats.albumTypes.single },
		{ link: JamRouteLinks.folders(), value: data.stats.folder },
		{ link: JamRouteLinks.tracks(), value: data.stats.track },
		{ link: JamRouteLinks.genres(), value: data.genres?.total },
		{ link: JamRouteLinks.podcasts(), value: data.podcasts?.total }
	].filter(t => t.value > 0);

	const user = transformUserData(data.currentUser);
	return { homeData, stats, user };
}

function transformVariables(): void {
	return;
}

export const HomeQuery: {
	query: DocumentNode;
	transformData: (d?: HomeResultQuery, variables?: {}) => HomeDataResult | undefined;
	transformVariables: () => void;
} = { query: HomeResultDocument, transformData, transformVariables };

export const useLazyHomeDataQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; homeData?: HomeDataResult; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<HomeResultQuery, {}, HomeDataResult>(HomeQuery.query, HomeQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, homeData: data }];
};
