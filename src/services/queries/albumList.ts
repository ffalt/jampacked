import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, useListFunction} from '../types';
import {useCallback} from 'react';
import {AlbumListResult, AlbumListResultVariables} from './types/AlbumListResult';
import {getCacheOrQuery, useCacheOrLazyQuery} from '../cache-query';
import {JamApolloClient} from '../apollo';

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

export async function getAlbumList(
	albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, client: JamApolloClient
): Promise<BaseEntryList | undefined> {
	return getCacheOrQuery<AlbumListResult, AlbumListResultVariables, BaseEntryList>(client, GET_ALBUMLIST, {albumTypes, listType, skip, take, seed}, transformData);
}

export const useLazyAlbumListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<AlbumListResult, AlbumListResultVariables, BaseEntryList>(GET_ALBUMLIST, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: {albumTypes, listType, skip, take, seed}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
