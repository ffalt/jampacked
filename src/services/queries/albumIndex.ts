import { AlbumType, JamObjectType } from '../jam';
import { DocumentNode } from 'graphql';
import { useCacheOrLazyQuery } from '../cache.hooks.ts';
import { useCallback } from 'react';
import { AlbumIndexResultDocument, AlbumIndexResultQuery, AlbumIndexResultQueryVariables } from './albumIndex.api';
import { ErrorLike } from '@apollo/client';
import { Index } from '../../types/indexes.ts';

function transformData(data?: AlbumIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	for (const group of data.albumIndex.groups) {
		for (const entry of group.items) {
			index.push({
				id: entry.id,
				objType: JamObjectType.album,
				desc: entry.artist?.name,
				title: entry.name,
				letter: group.name
			});
		}
	}
	return index;
}

function transformVariables(albumTypes: Array<AlbumType>): AlbumIndexResultQueryVariables {
	return { albumTypes };
}

export const AlbumIndexQuery: {
	query: DocumentNode;
	transformData: (d?: AlbumIndexResultQuery, variables?: AlbumIndexResultQueryVariables) => Index | undefined;
	transformVariables: (albumTypes: Array<AlbumType>) => AlbumIndexResultQueryVariables;
} = { query: AlbumIndexResultDocument, transformData, transformVariables };

export const useLazyAlbumIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<AlbumIndexResultQuery, AlbumIndexResultQueryVariables, Index>(AlbumIndexQuery.query, AlbumIndexQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, forceRefresh?: boolean): void => {
		query(AlbumIndexQuery.transformVariables(albumTypes), {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, index: data }];
};
