import { TrackEntry, UseGetCallFunctionTransform } from '../types';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { BookmarkResultDocument, BookmarkResultQuery, BookmarkResultQueryVariables } from './bookmarks.api';
import { transformTrack } from './track.ts';
import { transformEpisode } from './playlist.ts';

export interface Bookmarks {
	total: number;
	skip?: number;
	take?: number;
	tracks: Array<TrackEntry>;
}

function transformData(data?: BookmarkResultQuery): Bookmarks | undefined {
	if (!data) {
		return;
	}
	const tracks: Array<TrackEntry> = [];
	(data.bookmarks.items || []).map(entry => {
		const item = entry.track ? transformTrack(entry.track) : transformEpisode(entry.episode);
		if (item) {
			tracks.push(item);
		}
	});
	return {
		total: data.bookmarks.total,
		skip: data.bookmarks.skip === null ? undefined : data.bookmarks.skip,
		take: data.bookmarks.take === null ? undefined : data.bookmarks.take,
		tracks
	};
}

const transformVariables: UseGetCallFunctionTransform<BookmarkResultQueryVariables> =
	(take, skip) => {
		return { skip, take };
	};

export const BookmarksQuery: {
	query: DocumentNode;
	transformData: (d?: BookmarkResultQuery, variables?: BookmarkResultQueryVariables) => Bookmarks | undefined;
	transformVariables: UseGetCallFunctionTransform<BookmarkResultQueryVariables>;
} = { query: BookmarkResultDocument, transformData, transformVariables };

export const useLazyBookmarksQuery = (): [(take: number, skip: number, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, bookmarks?: Bookmarks, called: boolean }
] => {
	const [query, { loading, error, data, called }] = useCacheOrLazyQuery<BookmarkResultQuery, BookmarkResultQueryVariables, Bookmarks>(BookmarksQuery.query, BookmarksQuery.transformData);
	const get = useCallback((take: number, skip: number, forceRefresh?: boolean): void => {
		query({ variables: BookmarksQuery.transformVariables(take, skip) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, bookmarks: data }];
};
