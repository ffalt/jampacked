import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList} from '../types';
import {FolderListResult, FolderListResultVariables} from './types/FolderListResult';
import {titleCase} from '../../utils/format.utils';
import {DocumentNode} from 'graphql';

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

function transformVariables(albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number): FolderListResultVariables {
	return {albumTypes, listType, skip, take, seed};
}

export const FolderIndexQuery: {
	query: DocumentNode;
	transformData: (d?: FolderListResult, variables?: FolderListResultVariables) => BaseEntryList | undefined;
	transformVariables: (albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number) => FolderListResultVariables;
} = {query: GET_FOLDERLIST, transformData, transformVariables};

