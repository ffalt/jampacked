import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {SeriesResult, SeriesResultVariables} from './types/SeriesResult';
import {useCallback} from 'react';
import {Series, SeriesQuery} from './series';

export const useLazySeriesQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, series?: Series, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<SeriesResult, SeriesResultVariables, Series>(SeriesQuery.query, SeriesQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: SeriesQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, series: data}];
};
