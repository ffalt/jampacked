import { DocumentNode } from 'graphql';
import { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache.hooks.ts';
import { useCallback } from 'react';
import { PodcastEpisodeResultDocument, PodcastEpisodeResultQuery, PodcastEpisodeResultQueryVariables } from './podcastEpisode.api';
import { transformPodcastEpisode } from './podcast';
import { TrackEntry } from '../../types/track.ts';

export const transformData = (data?: PodcastEpisodeResultQuery): TrackEntry | undefined => {
	if (!data) {
		return;
	}
	const { episode } = data;
	const podcast = episode.podcast;
	return transformPodcastEpisode(podcast.name, podcast.id, episode);
};

function transformVariables(id: string): PodcastEpisodeResultQueryVariables {
	return { id };
}

export const PodcastEpisodeQuery: {
	query: DocumentNode;
	transformData: (d?: PodcastEpisodeResultQuery, variables?: PodcastEpisodeResultQueryVariables) => TrackEntry | undefined;
	transformVariables: (id: string) => PodcastEpisodeResultQueryVariables;
} = { query: PodcastEpisodeResultDocument, transformData, transformVariables };

export const useLazyPodcastEpisodeQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; track?: TrackEntry; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<PodcastEpisodeResultQuery, PodcastEpisodeResultQueryVariables, TrackEntry>(PodcastEpisodeQuery.query, PodcastEpisodeQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query(PodcastEpisodeQuery.transformVariables(id), {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, track: data }];
};
