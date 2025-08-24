import { ListType } from '../jam';
import { TrackEntryList, useTrackListFunction } from '../types';
import { DocumentNode } from 'graphql';
import { transformTrack } from './track';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { TrackListResultDocument, TrackListResultQuery, TrackListResultQueryVariables } from './trackList.api';

function transformData(data?: TrackListResultQuery, variables?: TrackListResultQueryVariables): TrackEntryList | undefined {
	if (!data) {
		return;
	}
	const result: TrackEntryList = {
		total: data.tracks.total,
		skip: data.tracks.skip ?? undefined,
		take: data.tracks.take ?? undefined,
		listType: variables?.listType ?? undefined,
		items: []
	};
	for (const entry of data.tracks.items) {
		result.items.push(transformTrack(entry));
	}
	return result;
}

function transformVariables(listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number): TrackListResultQueryVariables {
	return { listType, genreIDs, skip, take, seed };
}

export const TrackListQuery: {
	query: DocumentNode;
	transformData: (d?: TrackListResultQuery, variables?: TrackListResultQueryVariables) => TrackEntryList | undefined;
	transformVariables: (listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number) => TrackListResultQueryVariables;
} = { query: TrackListResultDocument, transformData, transformVariables };

export const useLazyTrackListQuery: useTrackListFunction = () => {
	const [query, { loading, error, data, called, queryID }] =
		useCacheOrLazyQuery<TrackListResultQuery, TrackListResultQueryVariables, TrackEntryList>(TrackListQuery.query, TrackListQuery.transformData);
	const get = useCallback((listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query(TrackListQuery.transformVariables(listType, genreIDs, seed, take, skip), {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, data, queryID }];
};
