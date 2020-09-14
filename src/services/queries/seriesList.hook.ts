import {BaseEntryList, useListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {SeriesListResult, SeriesListResultVariables} from './types/SeriesListResult';
import {useCallback} from 'react';
import {AlbumType, ListType} from '../jam';
import {SeriesListQuery} from './seriesList';

export const useLazySeriesListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<SeriesListResult, SeriesListResultVariables, BaseEntryList>(SeriesListQuery.query, SeriesListQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: SeriesListQuery.transformVariables(albumTypes, listType, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
