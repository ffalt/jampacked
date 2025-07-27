import { JamObjectType } from '../jam';
import { Index } from '../types';
import { titleCase } from '../../utils/format.utils';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { FolderIndexResultDocument, FolderIndexResultQuery, FolderIndexResultQueryVariables } from './folderIndex.api';

function transformData(data?: FolderIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	for (const group of data.folderIndex.groups) {
		for (const entry of group.items) {
			const desc = `${titleCase(entry.folderType || '')}`;
			index.push({
				id: entry.id,
				objType: JamObjectType.folder,
				desc,
				title: entry.name,
				letter: group.name
			});
		}
	}
	return index;
}

function transformVariables(level: number): FolderIndexResultQueryVariables {
	return { level };
}

export const FolderIndexQuery: {
	query: DocumentNode;
	transformData: (d?: FolderIndexResultQuery, variables?: FolderIndexResultQueryVariables) => Index | undefined;
	transformVariables: (level: number) => FolderIndexResultQueryVariables;
} = { query: FolderIndexResultDocument, transformData, transformVariables };

export const useLazyFolderIndexQuery = (): [(level: number, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<FolderIndexResultQuery, FolderIndexResultQueryVariables, Index>(FolderIndexQuery.query, FolderIndexQuery.transformData);
	const get = useCallback((level: number, forceRefresh?: boolean): void => {
		query({ variables: FolderIndexQuery.transformVariables(level) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, index: data }];
};
