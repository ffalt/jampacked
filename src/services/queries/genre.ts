import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { GenreResultDocument, GenreResultQuery, GenreResultQueryVariables } from './genre.api';

export interface Genre {
	id: string;
	name: string;
}

function transformData(data?: GenreResultQuery): Genre | undefined {
	if (!data?.genre) {
		return;
	}
	return {
		id: data.genre.id,
		name: data.genre.name
	};
}

function transformVariables(id: string): GenreResultQueryVariables {
	return { id };
}

export const GenreQuery: {
	query: DocumentNode;
	transformData: (d?: GenreResultQuery, variables?: GenreResultQueryVariables) => Genre | undefined;
	transformVariables: (id: string) => GenreResultQueryVariables;
} = { query: GenreResultDocument, transformData, transformVariables };

export const useLazyGenreQuery = (): [
	(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; called: boolean; genre?: Genre }
] => {
	const [query, { loading, error, data, called }] = useCacheOrLazyQuery<GenreResultQuery, GenreResultQueryVariables, Genre>(GenreQuery.query, GenreQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({ variables: GenreQuery.transformVariables(id) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, genre: data }];
};
