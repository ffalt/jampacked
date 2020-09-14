import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList} from '../types';
import {ArtistListResult, ArtistListResultVariables} from './types/ArtistListResult';
import {DocumentNode} from 'graphql';

const GET_ARTISTLIST = gql`
    query ArtistListResult($listType: ListType!, $seed: String, $albumTypes: [AlbumType!], $take: Int!, $skip: Int!) {
        artists(list: $listType, seed: $seed, filter: {albumTypes: $albumTypes}, page: {take: $take, skip: $skip}) {
            total
            skip
            take
            items {
                id
                name
                albumsCount
            }
        }
    }
`;

function transformData(data?: ArtistListResult, variables?: ArtistListResultVariables): BaseEntryList | undefined {
	if (!data) {
		return;
	}
	const result: BaseEntryList = {
		total: data.artists.total,
		skip: data.artists.skip === null ? undefined : data.artists.skip,
		take: data.artists.take === null ? undefined : data.artists.take,
		listType: !variables?.listType ? undefined : variables.listType,
		items: []
	};
	data.artists.items.forEach(entry => {
		result.items.push({
			id: entry.id,
			objType: JamObjectType.artist,
			desc: `Albums: ${entry.albumsCount}`,
			title: entry.name
		});
	});
	return result;
}

function transformVariables(albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number): ArtistListResultVariables {
	return {albumTypes, listType, skip, take, seed};
}

export const ArtistIndexQuery: {
	query: DocumentNode;
	transformData: (d?: ArtistListResult, variables?: ArtistListResultVariables) => BaseEntryList | undefined;
	transformVariables: (albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number) => ArtistListResultVariables;
} = {query: GET_ARTISTLIST, transformData, transformVariables};
