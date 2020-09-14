import {ApolloError} from 'apollo-client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {HomeResult} from './types/HomeResult';
import {useCallback} from 'react';
import {HomeDataResult, HomeQuery} from './home';

export const useLazyHomeDataQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, homeData?: HomeDataResult, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<HomeResult, void, HomeDataResult>(HomeQuery.query, HomeQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, homeData: data}];
};
