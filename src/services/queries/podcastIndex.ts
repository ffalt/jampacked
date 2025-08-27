import { JamObjectType } from '../jam';
import { DocumentNode } from 'graphql';
import { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache.hooks.ts';
import { useCallback } from 'react';
import { PodcastIndexResultDocument, PodcastIndexResultQuery } from './podcastIndex.api';
import { Index } from '../../types/indexes.ts';

function transformData(data?: PodcastIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	for (const podcast of data.podcasts.items) {
		index.push({
			id: podcast.id,
			objType: JamObjectType.podcast,
			desc: `Episodes: ${podcast.episodesCount}`,
			title: podcast.name,
			letter: podcast.name[0]
		});
	}
	return index;
}

function transformVariables(): void {
	return;
}

export const PodcastIndexQuery: {
	query: DocumentNode;
	transformData: (d?: PodcastIndexResultQuery, variables?: {}) => Index | undefined;
	transformVariables: () => void;
} = { query: PodcastIndexResultDocument, transformData, transformVariables };

export const useLazyPodcastIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] = useCacheOrLazyQuery<PodcastIndexResultQuery, {}, Index>(PodcastIndexQuery.query, PodcastIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, index: data }];
};
