import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList} from '../types';
import {AlbumListResult, AlbumListResultVariables} from './types/AlbumListResult';
import {DocumentNode} from 'graphql';

const GET_ALBUMLIST = gql`
    query AlbumListResult($listType: ListType!, $seed: String, $albumTypes: [AlbumType!], $take: Int!, $skip: Int!) {
        albums(list: $listType, seed: $seed, filter: {albumTypes: $albumTypes}, page: {take: $take, skip: $skip}) {
            total
            skip
            take
            items {
                id
                name
                artist {
                    name
                }
            }
        }
    }
`;

function transformData(data?: AlbumListResult, variables?: AlbumListResultVariables): BaseEntryList | undefined {
	if (!data) {
		return;
	}
	const result: BaseEntryList = {
		total: data.albums.total,
		skip: data.albums.skip === null ? undefined : data.albums.skip,
		take: data.albums.take === null ? undefined : data.albums.take,
		listType: !variables?.listType ? undefined : variables.listType,
		items: []
	};
	data.albums.items.forEach(entry => {
		result.items.push({
			id: entry.id,
			objType: JamObjectType.album,
			desc: entry.artist?.name,
			title: entry.name
		});
	});
	return result;
}

function transformVariables(albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number): AlbumListResultVariables {
	return {albumTypes, listType, skip, take, seed};
}

export const AlbumIndexQuery: {
	query: DocumentNode;
	transformData: (d?: AlbumListResult, variables?: AlbumListResultVariables) => BaseEntryList | undefined;
	transformVariables: (albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number) => AlbumListResultVariables;
} = {query: GET_ALBUMLIST, transformData, transformVariables};

