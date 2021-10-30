import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {TrackLyricsResult, TrackLyricsResultVariables} from './types/TrackLyricsResult';
import {useCallback} from 'react';
import {TrackLyrics, TrackLyricsQuery} from './lyrics';

export const useLazyTrackLyricsQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, lyrics?: TrackLyrics, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<TrackLyricsResult, TrackLyricsResultVariables, TrackLyrics>(TrackLyricsQuery.query, TrackLyricsQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: TrackLyricsQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, lyrics: data}];
};
