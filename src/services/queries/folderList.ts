import { AlbumType, JamObjectType, ListType } from '../jam';
import { BaseEntryList, UseListCallFunctionTransform, useListFunction } from '../types';
import { titleCase } from '../../utils/format.utils';
import { DocumentNode } from 'graphql';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { FolderListResultDocument, FolderListResultQuery, FolderListResultQueryVariables } from './folderList.api';

function transformData(data?: FolderListResultQuery, variables?: FolderListResultQueryVariables): BaseEntryList | undefined {
	if (!data) {
		return;
	}
	const result: BaseEntryList = {
		total: data.folders.total,
		skip: data.folders.skip ?? undefined,
		take: data.folders.take ?? undefined,
		listType: variables?.listType ?? undefined,
		items: []
	};
	for (const entry of data.folders.items) {
		const desc = `${titleCase(entry.folderType ?? '')}`;
		result.items.push({
			id: entry.id,
			objType: JamObjectType.folder,
			desc,
			title: entry.name
		});
	}
	return result;
}

const transformVariables: UseListCallFunctionTransform<FolderListResultQueryVariables> =
	(albumTypes, listType, genreIDs, seed, take, skip) =>
		({ albumTypes, listType, genreIDs, skip, take, seed });

export const FolderIndexQuery: {
	query: DocumentNode;
	transformData: (d?: FolderListResultQuery, variables?: FolderListResultQueryVariables) => BaseEntryList | undefined;
	transformVariables: UseListCallFunctionTransform<FolderListResultQueryVariables>;
} = { query: FolderListResultDocument, transformData, transformVariables };

export const useLazyFolderListQuery: useListFunction = () => {
	const [query, { loading, error, data, called, queryID }] =
		useCacheOrLazyQuery<FolderListResultQuery, FolderListResultQueryVariables, BaseEntryList>(FolderIndexQuery.query, FolderIndexQuery.transformData);
	const get = useCallback((
		albumTypes: Array<AlbumType>,
		listType: ListType | undefined,
		genreIDs: Array<string>,
		seed: string | undefined,
		take: number,
		skip: number,
		forceRefresh?: boolean
	): void => {
		query(FolderIndexQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip), {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, data, queryID }];
};
