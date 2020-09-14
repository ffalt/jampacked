import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {PlaylistIndexResult} from './types/PlaylistIndexResult';
import {useCallback} from 'react';
import {PlaylistIndexQuery} from './playlistIndex';

export const useLazyPlaylistIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<PlaylistIndexResult, void, Index>(PlaylistIndexQuery.query, PlaylistIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [get, {loading, error, called, index: data}];
};
