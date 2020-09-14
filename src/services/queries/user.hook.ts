import {ApolloError} from 'apollo-client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {UserResult} from './types/UserResult';
import {useCallback} from 'react';
import {UserDataResult, UserQuery} from './user';

export const useLazyUserDataQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, userData?: UserDataResult, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<UserResult, void, UserDataResult>(UserQuery.query, UserQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, userData: data}];
};
