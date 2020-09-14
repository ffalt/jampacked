import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, useListFunction} from '../types';
import {useCallback} from 'react';
import {FolderListResult, FolderListResultVariables} from './types/FolderListResult';
import {getCacheOrQuery, useCacheOrLazyQuery} from '../cache-query';
import {JamApolloClient} from '../apollo';
import {titleCase} from '../../utils/format.utils';

const GET_FOLDERLIST = gql`
    query FolderListResult($listType: ListType!, $seed: String, $albumTypes: [AlbumType!], $take: Int!, $skip: Int!) {
        folders(list: $listType, seed: $seed, filter: {albumTypes: $albumTypes}, page: {take: $take, skip: $skip}) {
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

export async function getFolderList(
	albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, client: JamApolloClient
): Promise<BaseEntryList | undefined> {
	return getCacheOrQuery<FolderListResult, FolderListResultVariables, BaseEntryList>(client, GET_FOLDERLIST, {albumTypes, listType, skip, take, seed}, transformData);
}

export const useLazyFolderListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<FolderListResult, FolderListResultVariables, BaseEntryList>(GET_FOLDERLIST, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: {albumTypes, listType, skip, take, seed}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
