import {TrackEntryList, useTrackListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {TrackListResult, TrackListResultVariables} from './types/TrackListResult';
import {useCallback} from 'react';
import {ListType} from '../jam';
import {TrackListQuery} from './trackList';

export const useLazyTrackListQuery: useTrackListFunction = () => {
	const [query, {loading, error, data, called, queryID}] =
		useCacheOrLazyQuery<TrackListResult, TrackListResultVariables, TrackEntryList>(TrackListQuery.query, TrackListQuery.transformData);
	const get = useCallback((listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: TrackListQuery.transformVariables(listType, genreIDs, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
