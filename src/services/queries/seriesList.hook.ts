import {BaseEntryList, useListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {SeriesListResult, SeriesListResultVariables} from './types/SeriesListResult';
import {useCallback} from 'react';
import {SeriesListQuery} from './seriesList';

export const useLazySeriesListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<SeriesListResult, SeriesListResultVariables, BaseEntryList>(SeriesListQuery.query, SeriesListQuery.transformData);
	const get = useCallback((albumTypes, listType, genreIDs, seed, take, skip, forceRefresh): void => {
		query({variables: SeriesListQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
