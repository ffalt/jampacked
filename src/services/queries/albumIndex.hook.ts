import {AlbumType} from '../jam';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {AlbumIndexResult, AlbumIndexResultVariables} from './types/AlbumIndexResult';
import {useCallback} from 'react';
import {AlbumIndexQuery} from './albumIndex';

export const useLazyAlbumIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<AlbumIndexResult, AlbumIndexResultVariables, Index>(AlbumIndexQuery.query, AlbumIndexQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, forceRefresh?: boolean): void => {
		query({variables: AlbumIndexQuery.transformVariables(albumTypes)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, index: data}];
};
