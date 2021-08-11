import {BaseEntryList, useListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {AlbumListResult, AlbumListResultVariables} from './types/AlbumListResult';
import {useCallback} from 'react';
import {AlbumType, ListType} from '../jam';
import {AlbumListQuery} from './albumList';

export const useLazyAlbumListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<AlbumListResult, AlbumListResultVariables, BaseEntryList>(AlbumListQuery.query, AlbumListQuery.transformData);
	const get = useCallback((
		albumTypes: Array<AlbumType>,
		listType: ListType | undefined,
		genreIDs: Array<string>,
		seed: string | undefined,
		take: number,
		skip: number,
		forceRefresh?: boolean
	): void => {
		query({variables: AlbumListQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
