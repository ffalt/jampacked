import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {useCallback} from 'react';
import {TrackLyricsResult, TrackLyricsResultVariables} from './types/TrackLyricsResult';
import {useCacheOrLazyQuery} from '../data';

const GET_TRACKLYRICS = gql`
    query TrackLyricsResult($id: ID!) {
        track(id:$id) {
            id
            lyrics {
                lyrics
                source
            }
        }
    }
`;

interface TrackLyrics {
	lyrics?: string;
	source?: string;
}

export const transformData = (data?: TrackLyricsResult): TrackLyrics | undefined => {
	return data ? {
		lyrics: data.track?.lyrics?.lyrics || undefined,
		source: data.track?.lyrics?.source || undefined
	} : undefined;
};

export const useLazyTrackLyricsQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, lyrics?: TrackLyrics, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<TrackLyricsResult, TrackLyricsResultVariables, TrackLyrics>(GET_TRACKLYRICS, transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			lyrics: data
		}
	];
};
