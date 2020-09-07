import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, useListFunction} from '../types';
import {useCallback} from 'react';
import {FolderListResult, FolderListResultVariables} from './types/FolderListResult';
import {useCacheOrLazyQuery} from '../data';

const GET_FOLDERLIST = gql`
    query FolderListResult($listType: ListType!, $albumTypes: [AlbumType!], $take: Int!, $skip: Int!) {
        folders(list: $listType, filter: {albumTypes: $albumTypes}, page: {take: $take, skip: $skip}) {
            total
            skip
            take
            items {
                id
                name
                folderType
                tracksCount
                childrenCount
            }
        }
    }
`;

function transformData(data?: FolderListResult, variables?: FolderListResultVariables): BaseEntryList | undefined {
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
		const desc = (entry.folderType || '') + ' ' + (
			(entry.tracksCount || 0) > 0 ? `Tracks: ${entry.tracksCount}` :
				((entry.childrenCount || 0) > 0 ? `Folder: ${entry.childrenCount}` : '')
		);
		result.items.push({
			id: entry.id,
			objType: JamObjectType.folder,
			desc,
			title: entry.name
		});
	});
	return result;
}

export const useLazyFolderListQuery: useListFunction = () => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<FolderListResult, FolderListResultVariables, BaseEntryList>(GET_FOLDERLIST, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: {albumTypes, listType, skip, take}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data}];
};
