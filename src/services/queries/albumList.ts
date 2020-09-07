import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {BaseEntry} from '../types';
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


interface AlbumList {
	listType?: ListType;
	items: Array<BaseEntry>;
	total: number;
	skip?: number;
	take?: number;
}

function transformData(data?: AlbumListResult, variables?: AlbumListResultVariables): AlbumList | undefined {
	if (!data) {
		return;
	}
	const result: AlbumList = {
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

export const useLazyAlbumListQuery = (): [(albumTypes: Array<AlbumType>, listType: ListType, take: number, skip: number, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, data?: AlbumList, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<AlbumListResult, AlbumListResultVariables, AlbumList>(GET_ALBUMLIST, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: {albumTypes, listType, skip, take}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data}];
};
