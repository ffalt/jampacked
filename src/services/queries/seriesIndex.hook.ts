import {ApolloError} from '@apollo/client';
import {Index} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {SeriesIndexResult} from './types/SeriesIndexResult';
import {useCallback} from 'react';
import {SeriesIndexQuery} from './seriesIndex';

export const useLazySeriesIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<SeriesIndexResult, void, Index>(SeriesIndexQuery.query, SeriesIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			error,
			called,
			index: data
		}
	];
};
