import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {FolderResult, FolderResultVariables} from './types/FolderResult';
import {useCallback} from 'react';
import {Folder, FolderQuery} from './folder';

export const useLazyFolderQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, folder?: Folder, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<FolderResult, FolderResultVariables, Folder>(FolderQuery.query, FolderQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: FolderQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, folder: data}];
};
