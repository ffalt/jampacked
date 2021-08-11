import {BaseEntryList, useListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {ArtistListResult, ArtistListResultVariables} from './types/ArtistListResult';
import {useCallback} from 'react';
import {AlbumType, ListType} from '../jam';
import {ArtistListQuery} from './artistList';

export const useLazyArtistListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<ArtistListResult, ArtistListResultVariables, BaseEntryList>(ArtistListQuery.query, ArtistListQuery.transformData);
	const get = useCallback((
		albumTypes: Array<AlbumType>,
		listType: ListType | undefined,
		genreIDs: Array<string>,
		seed: string | undefined,
		take: number,
		skip: number,
		forceRefresh?: boolean
	): void => {
		query({variables: ArtistListQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
