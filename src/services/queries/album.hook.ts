import {ApolloError} from 'apollo-client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {AlbumResult, AlbumResultVariables} from './types/AlbumResult';
import {useCallback} from 'react';
import {Album, AlbumQuery} from './album';

export const useLazyAlbumQuery = (): [
	(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, called: boolean, album?: Album }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<AlbumResult, AlbumResultVariables, Album>(AlbumQuery.query, AlbumQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: AlbumQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, album: data}];
};
