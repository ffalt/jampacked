import {AlbumType, JamObjectType, ListType} from '../jam';
import {BaseEntryList, UseListCallFunctionTransform, useListFunction} from '../types';
import {titleCase} from '../../utils/format.utils';
import {DocumentNode} from 'graphql';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {useCallback} from 'react';
import {FolderListResultDocument, FolderListResultQuery, FolderListResultQueryVariables} from './folderList.api';

function transformData(data?: FolderListResultQuery, variables?: FolderListResultQueryVariables): BaseEntryList | undefined {
	if (!data) {
		return;
	}
	const result: BaseEntryList = {
		total: data.folders.total,
		skip: data.folders.skip === null ? undefined : data.folders.skip,
		take: data.folders.take === null ? undefined : data.folders.take,
		listType: !variables?.listType ? undefined : variables.listType,
		items: []
	};
	data.folders.items.forEach(entry => {
		const desc = `${titleCase(entry.folderType || '')}`;
		// const desc = (entry.folderType || '') + ' ' + (
		// 	(entry.tracksCount || 0) > 0 ? `Tracks: ${entry.tracksCount}` :
		// 		((entry.childrenCount || 0) > 0 ? `Folder: ${entry.childrenCount}` : '')
		// );
		result.items.push({
			id: entry.id,
			objType: JamObjectType.folder,
			desc,
			title: entry.name
		});
	});
	return result;
}

const transformVariables: UseListCallFunctionTransform<FolderListResultQueryVariables> = (albumTypes, listType, genreIDs, seed, take, skip) => {
	return {albumTypes, listType, genreIDs, skip, take, seed};
};

export const FolderIndexQuery: {
	query: DocumentNode;
	transformData: (d?: FolderListResultQuery, variables?: FolderListResultQueryVariables) => BaseEntryList | undefined;
	transformVariables: UseListCallFunctionTransform<FolderListResultQueryVariables>;
} = {query: FolderListResultDocument, transformData, transformVariables};


export const useLazyFolderListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] =
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
		query({variables: FolderIndexQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
