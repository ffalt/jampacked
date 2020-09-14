import {BaseEntryList, useListFunction} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {FolderListResult, FolderListResultVariables} from './types/FolderListResult';
import {useCallback} from 'react';
import {AlbumType, ListType} from '../jam';
import {FolderIndexQuery} from './folderList';

export const useLazyFolderListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<FolderListResult, FolderListResultVariables, BaseEntryList>(FolderIndexQuery.query, FolderIndexQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: FolderIndexQuery.transformVariables(albumTypes, listType, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
