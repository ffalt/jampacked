import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {useCallback} from 'react';
import {useCacheOrLazyQuery} from '../data';
import {UserResult, UserResult_currentUser_stats_favorite, UserResult_currentUser_stats_played} from './types/UserResult';
import {HomeStatsData} from '../types';
import {HomeRoute} from '../../navigators/Routing';
import {getTypeByAlbumType} from '../jam-lists';
import {AlbumType} from '../jam';

const GET_USERDATA = gql`
    query UserResult {
        currentUser {
            stats {
                bookmark
                playlist
                favorite {
                    album
                    albumTypes {
                        album
                        artistCompilation
                        audiobook
                        compilation
                        series
                        single
                        soundtrack
                        ep
                        live
                        bootleg
                        unknown
                    }
                    artist
                    artistTypes {
                        album
                    }
                    folder
                    series
                    track
                }
                played {
                    album
                    albumTypes {
                        album
                        artistCompilation
                        audiobook
                        compilation
                        series
                        single
                        soundtrack
                        ep
                        live
                        bootleg
                        unknown
                    }
                    artist
                    artistTypes {
                        album
                    }
                    folder
                    series
                    track
                }
            }
        }
    }
`;

export interface UserDataResult {
	stats: HomeStatsData;
	favorites: HomeStatsData;
	played: HomeStatsData;
}

function transformSectionStats(stats: UserResult_currentUser_stats_played | UserResult_currentUser_stats_favorite): HomeStatsData {
	return [
		{
			text: 'Artists',
			link: {route: HomeRoute.ARTISTS},
			value: stats.artistTypes.album
		},
		...[
			{type: getTypeByAlbumType(AlbumType.album), value: stats.albumTypes.album},
			{type: getTypeByAlbumType(AlbumType.compilation), value: stats.albumTypes.compilation}
		].map(t => ({
			text: t.type?.text || '',
			link: {route: HomeRoute.ALBUMS, params: {albumTypeID: t.type?.id || ''}},
			value: t.value
		})),
		{
			text: 'Series',
			link: {route: HomeRoute.SERIES},
			value: stats.series
		},
		...[
			{type: getTypeByAlbumType(AlbumType.audiobook), value: stats.albumTypes.audiobook},
			{type: getTypeByAlbumType(AlbumType.soundtrack), value: stats.albumTypes.soundtrack},
			{type: getTypeByAlbumType(AlbumType.live), value: stats.albumTypes.live},
			{type: getTypeByAlbumType(AlbumType.bootleg), value: stats.albumTypes.bootleg},
			{type: getTypeByAlbumType(AlbumType.ep), value: stats.albumTypes.ep},
			{type: getTypeByAlbumType(AlbumType.single), value: stats.albumTypes.single}
		].map(t => ({
			text: t.type?.text || '',
			link: {route: HomeRoute.ALBUMS, params: {albumTypeID: t.type?.id || ''}},
			value: t.value
		})),
		{
			text: 'Folders',
			link: {route: HomeRoute.FOLDERS},
			value: stats.folder
		},
		{
			text: 'Tracks',
			link: {route: HomeRoute.TRACKS},
			value: stats.track
		}
	].filter(t => t.value > 0) as HomeStatsData;
}

function transformData(data?: UserResult): UserDataResult | undefined {
	if (!data?.currentUser) {
		return;
	}
	const stats = data.currentUser.stats;
	const base: HomeStatsData = [
		{
			text: 'Bookmarks',
			link: {route: HomeRoute.ARTISTS},
			value: stats.bookmark
		},
		{
			text: 'Playlists',
			link: {route: HomeRoute.PLAYLISTS},
			value: stats.playlist
		}
	].filter(t => t.value !== undefined);
	const favorites: HomeStatsData = transformSectionStats(stats.favorite);
	const played: HomeStatsData = transformSectionStats(stats.played);
	return {stats: base, favorites, played};
}

export const useLazyUserDataQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, userData?: UserDataResult, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<UserResult, any, UserDataResult>(GET_USERDATA, transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			userData: data
		}
	];
};
