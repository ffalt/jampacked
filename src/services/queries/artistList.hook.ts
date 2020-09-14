import {BaseEntryList, useListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {ArtistListResult, ArtistListResultVariables} from './types/ArtistListResult';
import {useCallback} from 'react';
import {AlbumType, ListType} from '../jam';
import {ArtistIndexQuery} from './artistList';

export const useLazyArtistListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<ArtistListResult, ArtistListResultVariables, BaseEntryList>(ArtistIndexQuery.query, ArtistIndexQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: ArtistIndexQuery.transformVariables(albumTypes, listType, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
