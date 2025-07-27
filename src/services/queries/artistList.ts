import { AlbumType, JamObjectType, ListType } from '../jam';
import { BaseEntryList, UseListCallFunctionTransform, useListFunction } from '../types';
import { DocumentNode } from 'graphql';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { ArtistListResultDocument, ArtistListResultQuery, ArtistListResultQueryVariables } from './artistList.api';

function transformData(data?: ArtistListResultQuery, variables?: ArtistListResultQueryVariables): BaseEntryList | undefined {
	if (!data) {
		return;
	}
	const result: BaseEntryList = {
		total: data.artists.total,
		skip: data.artists.skip ?? undefined,
		take: data.artists.take ?? undefined,
		listType: variables?.listType ?? undefined,
		items: []
	};
	for (const entry of data.artists.items) {
		result.items.push({
			id: entry.id,
			objType: JamObjectType.artist,
			desc: `Albums: ${entry.albumsCount}`,
			title: entry.name
		});
	}
	return result;
}

const transformVariables: UseListCallFunctionTransform<ArtistListResultQueryVariables> =
	(albumTypes, listType, genreIDs, seed, take, skip) =>
		({ albumTypes, listType, genreIDs, skip, take, seed });

export const ArtistListQuery: {
	query: DocumentNode;
	transformData: (d?: ArtistListResultQuery, variables?: ArtistListResultQueryVariables) => BaseEntryList | undefined;
	transformVariables: UseListCallFunctionTransform<ArtistListResultQueryVariables>;
} = { query: ArtistListResultDocument, transformData, transformVariables };

export const useLazyArtistListQuery: useListFunction = () => {
	const [query, { loading, error, data, called, queryID }] =
		useCacheOrLazyQuery<ArtistListResultQuery, ArtistListResultQueryVariables, BaseEntryList>(ArtistListQuery.query, ArtistListQuery.transformData);
	const get = useCallback((
		albumTypes: Array<AlbumType>,
		listType: ListType | undefined,
		genreIDs: Array<string>,
		seed: string | undefined,
		take: number,
		skip: number,
		forceRefresh?: boolean
	): void => {
		query({ variables: ArtistListQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, data, queryID }];
};
