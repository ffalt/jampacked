import {ApolloError} from '@apollo/client';
import {Playlist, PlaylistQuery} from './playlist';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {PlaylistResult, PlaylistResultVariables} from './types/PlaylistResult';
import {useCallback} from 'react';

export const useLazyPlaylistQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, playlist?: Playlist, called: boolean }] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<PlaylistResult, PlaylistResultVariables, Playlist>(PlaylistQuery.query, PlaylistQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: PlaylistQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, error, called, playlist: data}];
};
