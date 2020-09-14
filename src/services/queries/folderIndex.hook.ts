import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {FolderIndexResult, FolderIndexResultVariables} from './types/FolderIndexResult';
import {useCallback} from 'react';
import {FolderIndexQuery} from './folderIndex';

export const useLazyFolderIndexQuery = (): [(level: number, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<FolderIndexResult, FolderIndexResultVariables, Index>(FolderIndexQuery.query, FolderIndexQuery.transformData);
	const get = useCallback((level: number, forceRefresh?: boolean): void => {
		query({variables: FolderIndexQuery.transformVariables(level)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, index: data}];
};
