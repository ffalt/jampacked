import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, useListFunction} from '../types';
import {useCallback} from 'react';
import {AlbumListResult, AlbumListResultVariables} from './types/AlbumListResult';
import {useCacheOrLazyQuery} from '../data';

const GET_ALBUMLIST = gql`
    query AlbumListResult($listType: ListType!, $albumTypes: [AlbumType!], $take: Int!, $skip: Int!) {
        albums(list: $listType, filter: {albumTypes: $albumTypes}, page: {take: $take, skip: $skip}) {
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

export const useLazyAlbumListQuery: useListFunction = () => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<AlbumListResult, AlbumListResultVariables, BaseEntryList>(GET_ALBUMLIST, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: {albumTypes, listType, skip, take}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data}];
};
