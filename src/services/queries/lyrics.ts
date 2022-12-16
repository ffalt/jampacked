import {DocumentNode} from 'graphql';
import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {useCallback} from 'react';
import {TrackLyricsResultDocument, TrackLyricsResultQuery, TrackLyricsResultQueryVariables} from './lyrics.api';

export interface TrackLyrics {
	lyrics?: string;
	source?: string;
}

export const transformData = (data?: TrackLyricsResultQuery): TrackLyrics | undefined => {
	return data ? {
		lyrics: data.track?.lyrics?.lyrics || undefined,
		source: data.track?.lyrics?.source || undefined
	} : undefined;
};

function transformVariables(id: string): TrackLyricsResultQueryVariables {
	return {id};
}

export const TrackLyricsQuery: {
	query: DocumentNode;
	transformData: (d?: TrackLyricsResultQuery, variables?: TrackLyricsResultQueryVariables) => TrackLyrics | undefined;
	transformVariables: (id: string) => TrackLyricsResultQueryVariables;
} = {query: TrackLyricsResultDocument, transformData, transformVariables};

export const useLazyTrackLyricsQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, lyrics?: TrackLyrics, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<TrackLyricsResultQuery, TrackLyricsResultQueryVariables, TrackLyrics>(TrackLyricsQuery.query, TrackLyricsQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: TrackLyricsQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, lyrics: data}];
};
