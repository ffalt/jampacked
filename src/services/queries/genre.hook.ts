import {ApolloError} from 'apollo-client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {GenreResult, GenreResultVariables} from './types/GenreResult';
import {useCallback} from 'react';
import {Genre, GenreQuery} from './genre';

export const useLazyGenreQuery = (): [
	(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, called: boolean, genre?: Genre }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<GenreResult, GenreResultVariables, Genre>(GenreQuery.query, GenreQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: GenreQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, genre: data}];
};
