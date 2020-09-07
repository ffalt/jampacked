import gql from 'graphql-tag';
import {TrackEntry} from '../types';
import {formatDuration} from '../../utils/duration.utils';
import {ApolloError} from 'apollo-client';
import {useCallback} from 'react';
import {TrackResult, TrackResultVariables} from './types/TrackResult';
import {useCacheOrLazyQuery} from '../data';

const GET_TRACK = gql`
    query TrackResult($id: ID!) {
        track(id:$id) {
            id
            name
            album {
                id
            }
            artist {
                id
            }
            series {
                id
            }
            tag {
                mediaDuration
                title
                artist
                genres
                album
                disc
                trackNr
            }
        }
    }
`;

interface Track {
	id: string;
	name: string;
	album?: { id: string };
	artist?: { id: string };
	series?: { id: string };
	tag?: {
		mediaDuration: number;
		title?: string;
		artist?: string;
		genre?: string;
		album?: string;
		disc?: number;
		trackNr?: number;
	}
}

export const transformData = (data?: TrackResult): TrackEntry | undefined => {
	if (!data) {
		return;
	}
	const {track} = data;
	return {
		id: track.id,
		title: track.tag?.title || track.name,
		artist: track.tag?.artist || '?',
		genre: track.tag?.genres ? track.tag?.genres.join(' / ') : undefined,
		album: track.tag?.album || '?',
		albumID: track.album?.id,
		artistID: track.artist?.id,
		seriesID: track.series?.id,
		trackNr: (track.tag?.disc && track.tag?.disc > 1 ? `${track.tag?.disc}-` : '') + (track.tag?.trackNr || ''),
		durationMS: track.tag?.mediaDuration || 0,
		duration: formatDuration(track.tag?.mediaDuration || undefined)
	};
};

export const useLazyTrackQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, track?: TrackEntry, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<TrackResult, TrackResultVariables, TrackEntry>(GET_TRACK, transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			track: data
		}
	];
};
