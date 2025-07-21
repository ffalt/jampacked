import { TrackEntry } from '../types';
import { formatDuration } from '../../utils/duration.utils';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { TrackResultDocument, TrackResultQuery, TrackResultQueryVariables } from './track.api';

export type TrackResult_track = NonNullable<TrackResultQuery>['track'];

export const transformTrack = (track: TrackResult_track): TrackEntry => {
	return {
		id: track.id,
		title: track.tag?.title || track.name,
		artist: track.artist?.name || '?',
		genre: track.genres?.length ? (track.genres || []).map(g => g.name).join(' / ') : undefined,
		album: track.album?.name || '?',
		albumID: track.album?.id,
		artistID: track.artist?.id,
		seriesID: track.series?.id,
		trackNr: (track.tag?.disc && track.tag?.disc > 1 ? `${track.tag?.disc}-` : '') + (track.tag?.trackNr || ''),
		durationMS: track.tag?.mediaDuration || 0,
		duration: formatDuration(track.tag?.mediaDuration || undefined)
	};
};

export const transformData = (data?: TrackResultQuery): TrackEntry | undefined => {
	if (!data) {
		return;
	}
	const { track } = data;
	return transformTrack(track);
};

function transformVariables(id: string): TrackResultQueryVariables {
	return { id };
}

export const TrackQuery: {
	query: DocumentNode;
	transformData: (d?: TrackResultQuery, variables?: TrackResultQueryVariables) => TrackEntry | undefined;
	transformVariables: (id: string) => TrackResultQueryVariables;
} = { query: TrackResultDocument, transformData, transformVariables };

export const useLazyTrackQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; track?: TrackEntry; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<TrackResultQuery, TrackResultQueryVariables, TrackEntry>(TrackQuery.query, TrackQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({ variables: TrackQuery.transformVariables(id) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, track: data }];
};
