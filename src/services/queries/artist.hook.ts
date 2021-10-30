import {ApolloError} from '@apollo/client';
import {Artist, ArtistQuery} from './artist';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {ArtistResult, ArtistResultVariables} from './types/ArtistResult';
import {useCallback} from 'react';

export const useLazyArtistQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, artist?: Artist, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<ArtistResult, ArtistResultVariables, Artist>(ArtistQuery.query, ArtistQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: ArtistQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, artist: data}];
};
