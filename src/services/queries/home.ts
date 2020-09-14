import gql from 'graphql-tag';
import {HomeData, HomeStatsData} from '../types';
import {HomeRoute} from '../../navigators/Routing';
import {AlbumType} from '../jam';
import {ApolloError} from 'apollo-client';
import {useCallback} from 'react';
import {HomeResult} from './types/HomeResult';
import {JamRouteLinks} from '../../navigators/Routes';
import {useCacheOrLazyQuery} from '../cache-query';

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
	const homeData: HomeData = {
		artistsRecent: (data.artistsRecent?.items || []).map(o => ({...o, route: HomeRoute.ARTIST})),
		artistsFaved: (data.artistsFaved?.items || []).map(o => ({...o, route: HomeRoute.ARTIST})),
		albumsFaved: (data.albumsFaved?.items || []).map(o => ({...o, route: HomeRoute.ALBUM})),
		albumsRecent: (data.albumsRecent?.items || []).map(o => ({...o, route: HomeRoute.ALBUM}))
	};
	const stats: HomeStatsData = [
		{link: JamRouteLinks.artists(), value: data.stats.artistTypes.album},
		{link: JamRouteLinks.albums(AlbumType.album), value: data.stats.albumTypes.album},
		{link: JamRouteLinks.albums(AlbumType.compilation), value: data.stats.albumTypes.compilation},
		{link: JamRouteLinks.series(), value: data.stats.series},
		{link: JamRouteLinks.albums(AlbumType.audiobook), value: data.stats.albumTypes.audiobook},
		{link: JamRouteLinks.albums(AlbumType.soundtrack), value: data.stats.albumTypes.soundtrack},
		{link: JamRouteLinks.albums(AlbumType.live), value: data.stats.albumTypes.live},
		{link: JamRouteLinks.albums(AlbumType.bootleg), value: data.stats.albumTypes.bootleg},
		{link: JamRouteLinks.albums(AlbumType.ep), value: data.stats.albumTypes.ep},
		{link: JamRouteLinks.albums(AlbumType.single), value: data.stats.albumTypes.single},
		{link: JamRouteLinks.folders(), value: data.stats.folder},
		{link: JamRouteLinks.tracks(), value: data.stats.track},
		{link: JamRouteLinks.podcasts(), value: data.podcasts?.total}
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
