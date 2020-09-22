import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {useCallback} from 'react';
import {GenreIndexQuery} from './genreIndex';
import {GenreIndexResult} from './types/GenreIndexResult';

export const useLazyGenreIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<GenreIndexResult, void, Index>(GenreIndexQuery.query, GenreIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			index: data
		}
	];
};
