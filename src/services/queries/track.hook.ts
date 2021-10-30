import {ApolloError} from '@apollo/client';
import {TrackEntry} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {TrackResult, TrackResultVariables} from './types/TrackResult';
import {useCallback} from 'react';
import {TrackQuery} from './track';

export const useLazyTrackQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, track?: TrackEntry, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<TrackResult, TrackResultVariables, TrackEntry>(TrackQuery.query, TrackQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: TrackQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, track: data}];
};
