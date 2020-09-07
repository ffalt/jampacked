import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, useListFunction} from '../types';
import {useCallback} from 'react';
import {ArtistListResult, ArtistListResultVariables} from './types/ArtistListResult';
import {useCacheOrLazyQuery} from '../data';

const GET_ARTISTLIST = gql`
    query ArtistListResult($listType: ListType!, $albumTypes: [AlbumType!], $take: Int!, $skip: Int!) {
        artists(list: $listType, filter: {albumTypes: $albumTypes}, page: {take: $take, skip: $skip}) {
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

export const useLazyArtistListQuery: useListFunction = () => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<ArtistListResult, ArtistListResultVariables, BaseEntryList>(GET_ARTISTLIST, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: {albumTypes, listType, skip, take}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data}];
};
