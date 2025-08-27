import { AlbumType, JamObjectType } from '../jam';
import { DocumentNode } from 'graphql';
import type { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache.hooks.ts';
import { useCallback } from 'react';
import { ArtistIndexResultDocument, ArtistIndexResultQuery, ArtistIndexResultQueryVariables } from './artistIndex.api';
import { Index } from '../../types/indexes.ts';

function transformData(data?: ArtistIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	for (const group of data.artistIndex.groups) {
		for (const entry of group.items) {
			index.push({
				id: entry.id,
				objType: JamObjectType.artist,
				desc: `Albums: ${entry.albumsCount}`,
				title: entry.name,
				letter: group.name
			});
		}
	}
	return index;
}

function transformVariables(albumTypes: Array<AlbumType>): ArtistIndexResultQueryVariables {
	return { albumTypes };
}

export const ArtistIndexQuery: {
	query: DocumentNode;
	transformData: (d?: ArtistIndexResultQuery, variables?: ArtistIndexResultQueryVariables) => Index | undefined;
	transformVariables: (albumTypes: Array<AlbumType>) => ArtistIndexResultQueryVariables;
} = { query: ArtistIndexResultDocument, transformData, transformVariables };

export const useLazyArtistIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] = useCacheOrLazyQuery<ArtistIndexResultQuery, ArtistIndexResultQueryVariables, Index>(ArtistIndexQuery.query, ArtistIndexQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, forceRefresh?: boolean): void => {
		query(ArtistIndexQuery.transformVariables(albumTypes), {}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			index: data
		}
	];
};
