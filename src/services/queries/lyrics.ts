import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import {useCallback, useEffect, useState} from 'react';
import {TrackLyricsResult, TrackLyricsResultVariables} from './types/TrackLyricsResult';

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
	lyrics: string;
	source: string;
}

export const transformData = (data?: TrackLyricsResult): TrackLyrics | undefined => {
	return data?.track?.lyrics?.lyrics ? {
		lyrics: data.track.lyrics.lyrics,
		source: data.track.lyrics.source || ''
	} : undefined;
};

export const useLazyTrackLyricsQuery = (): [(id: string) => void,
	{ loading: boolean, error?: ApolloError, lyrics?: TrackLyrics, called: boolean }
] => {
	const [lyrics, setLyrics] = useState<TrackLyrics | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<TrackLyricsResult, TrackLyricsResultVariables>(GET_TRACKLYRICS);

	useEffect(() => {
		setLyrics(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({variables: {id}});
	}, [query]);

	return [
		get,
		{
			loading,
			called,
			error,
			lyrics
		}
	];
};
