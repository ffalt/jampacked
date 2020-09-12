import gql from 'graphql-tag';
import {HomeData, HomeStatsData} from '../types';
import {HomeRoute} from '../../navigators/Routing';
import {getTypeByAlbumType} from '../jam-lists';
import {AlbumType} from '../jam';
import {ApolloError} from 'apollo-client';
import {useCallback} from 'react';
import {HomeResult} from './types/HomeResult';
import {useCacheOrLazyQuery} from '../data';

const GET_HOMEDATA = gql`
    query HomeResult {
        artistsRecent: artists(list: recent, page:{take:5}) {
            items {
                id
                name
            }
        }
        artistsFaved: artists(list: faved, page:{take:5}) {
            items {
                id
                name
            }
        }
        albumsRecent: albums(list: recent, page:{take:5}) {
            items {
                id
                name
            }
        }
        albumsFaved: albums(list: faved, page:{take:5}) {
            items {
                id
                name
            }
        }
        podcasts(page:{take:0}) {
            total
        }
        stats {
            track
            folder
            series
            artist
            artistTypes {
                album
                compilation
                artistCompilation
                unknown
                live
                audiobook
                soundtrack
                bootleg
                ep
                single
            }
            album
            albumTypes {
                album
                compilation
                artistCompilation
                unknown
                live
                audiobook
                soundtrack
                bootleg
                ep
                single
            }
        }
    }
`;

interface HomeDataResult {
	stats: HomeStatsData;
	homeData: HomeData;
}

function transformData(data?: HomeResult): HomeDataResult | undefined {
	if (!data) {
		return;
	}
	const homeData = {
		artistsRecent: (data.artistsRecent?.items || []).map(o => ({...o, route: HomeRoute.ARTIST})),
		artistsFaved: (data.artistsFaved?.items || []).map(o => ({...o, route: HomeRoute.ARTIST})),
		albumsFaved: (data.albumsFaved?.items || []).map(o => ({...o, route: HomeRoute.ALBUM})),
		albumsRecent: (data.albumsRecent?.items || []).map(o => ({...o, route: HomeRoute.ALBUM}))
	};
	const stats: HomeStatsData = [
		{
			text: 'Artists',
			link: {route: HomeRoute.ARTISTS},
			value: data.stats.artistTypes.album
		},
		...[
			{type: getTypeByAlbumType(AlbumType.album), value: data.stats.albumTypes.album},
			{type: getTypeByAlbumType(AlbumType.compilation), value: data.stats.albumTypes.compilation}
		].map(t => ({
			text: t.type?.text || '',
			link: {route: HomeRoute.ALBUMS, params: {albumUrlType: t.type?.id}},
			value: t.value
		})),
		{
			text: 'Series',
			link: {route: HomeRoute.SERIES},
			value: data.stats.series
		},
		...[
			{type: getTypeByAlbumType(AlbumType.audiobook), value: data.stats.albumTypes.audiobook},
			{type: getTypeByAlbumType(AlbumType.soundtrack), value: data.stats.albumTypes.soundtrack},
			{type: getTypeByAlbumType(AlbumType.live), value: data.stats.albumTypes.live},
			{type: getTypeByAlbumType(AlbumType.bootleg), value: data.stats.albumTypes.bootleg},
			{type: getTypeByAlbumType(AlbumType.ep), value: data.stats.albumTypes.ep},
			{type: getTypeByAlbumType(AlbumType.single), value: data.stats.albumTypes.single}
		].map(t => ({
			text: t.type?.text || '',
			link: {route: HomeRoute.ALBUMS, params: {albumUrlType: t.type?.id}},
			value: t.value
		})),
		{
			text: 'Folders',
			link: {route: HomeRoute.FOLDERS},
			value: data.stats.folder
		},
		{
			text: 'Tracks',
			link: {route: HomeRoute.TRACKS},
			value: data.stats.track
		},
		{
			text: 'Podcasts',
			link: {route: HomeRoute.PODCASTS},
			value: data.podcasts?.total
		}
	].filter(t => t.value > 0);

	return {homeData, stats};
}

export const useLazyHomeDataQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, homeData?: HomeDataResult, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<HomeResult, void, HomeDataResult>(GET_HOMEDATA, transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			homeData: data
		}
	];
};
