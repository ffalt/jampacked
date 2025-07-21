import { JamObjectType } from '../jam';
import { Index } from '../types';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { GenreIndexResultDocument, GenreIndexResultQuery } from './genreIndex.api';

function transformData(data?: GenreIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.genreIndex.groups.forEach((group) => {
		group.items.forEach((entry) => {
			index.push({
				id: entry.id,
				objType: JamObjectType.genre,
				desc: `Albums: ${entry.albumCount} - Artists: ${entry.artistCount} - Tracks: ${entry.trackCount}`,
				title: entry.name,
				letter: group.name
			});
		});
	});
	return index;
}

function transformVariables(): void {
	return;
}

export const GenreIndexQuery: {
	query: DocumentNode;
	transformData: (d?: GenreIndexResultQuery, variables?: void) => Index | undefined;
	transformVariables: () => void;
} = { query: GenreIndexResultDocument, transformData, transformVariables };

export const useLazyGenreIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<GenreIndexResultQuery, void, Index>(GenreIndexQuery.query, GenreIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
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
