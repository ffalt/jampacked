import {TrackEntryList, useTrackListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {TrackListResult, TrackListResultVariables} from './types/TrackListResult';
import {useCallback} from 'react';
import {ListType} from '../jam';
import {TrackIndexQuery} from './trackList';

export const useLazyTrackListQuery: useTrackListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<TrackListResult, TrackListResultVariables, TrackEntryList>(TrackIndexQuery.query, TrackIndexQuery.transformData);
	const get = useCallback((listType: ListType, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: TrackIndexQuery.transformVariables(listType, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
