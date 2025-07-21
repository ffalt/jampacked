import { AlbumType, JamObjectType, ListType } from '../jam';
import { BaseEntryList, UseListCallFunctionTransform, useListFunction } from '../types';
import { DocumentNode } from 'graphql';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { AlbumListResultDocument, AlbumListResultQuery, AlbumListResultQueryVariables } from './albumList.api';

function transformData(data?: AlbumListResultQuery, variables?: AlbumListResultQueryVariables): BaseEntryList | undefined {
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
	data.albums.items.forEach((entry) => {
		result.items.push({
			id: entry.id,
			objType: JamObjectType.album,
			desc: entry.artist?.name,
			title: entry.name
		});
	});
	return result;
}

const transformVariables: UseListCallFunctionTransform<AlbumListResultQueryVariables> = (albumTypes, listType, genreIDs, seed, take, skip) => {
	return { albumTypes, listType, genreIDs, skip, take, seed };
};

export const AlbumListQuery: {
	query: DocumentNode;
	transformData: (d?: AlbumListResultQuery, variables?: AlbumListResultQueryVariables) => BaseEntryList | undefined;
	transformVariables: UseListCallFunctionTransform<AlbumListResultQueryVariables>;
} = { query: AlbumListResultDocument, transformData, transformVariables };

export const useLazyAlbumListQuery: useListFunction = () => {
	const [query, { loading, error, data, called, queryID }] =
		useCacheOrLazyQuery<AlbumListResultQuery, AlbumListResultQueryVariables, BaseEntryList>(AlbumListQuery.query, AlbumListQuery.transformData);
	const get = useCallback((
		albumTypes: Array<AlbumType>,
		listType: ListType | undefined,
		genreIDs: Array<string>,
		seed: string | undefined,
		take: number,
		skip: number,
		forceRefresh?: boolean
	): void => {
		query({ variables: AlbumListQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, data, queryID }];
};
