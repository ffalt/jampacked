import { Index } from '../types';
import { JamObjectType } from '../jam';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { PodcastIndexResultDocument, PodcastIndexResultQuery } from './podcastIndex.api';

function transformData(data?: PodcastIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.podcasts.items.forEach((podcast) => {
		index.push({
			id: podcast.id,
			objType: JamObjectType.podcast,
			desc: `Episodes: ${podcast.episodesCount}`,
			title: podcast.name,
			letter: podcast.name[0]
		});
	});
	return index;
}

function transformVariables(): void {
	return;
}

export const PodcastIndexQuery: {
	query: DocumentNode;
	transformData: (d?: PodcastIndexResultQuery, variables?: void) => Index | undefined;
	transformVariables: () => void;
} = { query: PodcastIndexResultDocument, transformData, transformVariables };

export const useLazyPodcastIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] = useCacheOrLazyQuery<PodcastIndexResultQuery, void, Index>(PodcastIndexQuery.query, PodcastIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, index: data }];
};
