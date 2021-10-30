import {AlbumType} from '../jam';
import {ApolloError} from '@apollo/client';
import {Index} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {ArtistIndexResult, ArtistIndexResultVariables} from './types/ArtistIndexResult';
import {useCallback} from 'react';
import {ArtistIndexQuery} from './artistIndex';

export const useLazyArtistIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<ArtistIndexResult, ArtistIndexResultVariables, Index>(ArtistIndexQuery.query, ArtistIndexQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, forceRefresh?: boolean): void => {
		query({variables: ArtistIndexQuery.transformVariables(albumTypes)}, forceRefresh);
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
