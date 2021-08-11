import {JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, UseListCallFunctionTransform} from '../types';
import {AlbumListResult, AlbumListResultVariables} from './types/AlbumListResult';
import {DocumentNode} from 'graphql';

const GET_ALBUMLIST = gql`
    query AlbumListResult($listType: ListType, $seed: String, $albumTypes: [AlbumType!], $genreIDs: [ID!], $take: Int!, $skip: Int!) {
        albums(list: $listType, seed: $seed, filter: {albumTypes: $albumTypes, genreIDs: $genreIDs}, page: {take: $take, skip: $skip}) {
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

const transformVariables: UseListCallFunctionTransform<AlbumListResultVariables> = (albumTypes, listType, genreIDs, seed, take, skip) => {
	return {albumTypes, listType, genreIDs, skip, take, seed};
};

export const AlbumListQuery: {
	query: DocumentNode;
	transformData: (d?: AlbumListResult, variables?: AlbumListResultVariables) => BaseEntryList | undefined;
	transformVariables: UseListCallFunctionTransform<AlbumListResultVariables>;
} = {query: GET_ALBUMLIST, transformData, transformVariables};

