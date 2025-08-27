import { formatDuration } from '../../utils/duration.utils';
import { DocumentNode } from 'graphql';
import type { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache.hooks.ts';
import { useCallback } from 'react';
import { PodcastResultDocument, PodcastResultQuery, PodcastResultQueryVariables } from './podcast.api';
import { TrackEntry } from '../../types/track.ts';

export interface Podcast {
	id: string;
	name: string;
	description?: string;
	episodes: Array<TrackEntry>;
}

type PodcastResult_podcast_episodes = NonNullable<PodcastResultQuery>['podcast']['episodes'][number];

export const transformPodcastEpisode = (podcastName: string, podcastID: string, track: PodcastResult_podcast_episodes): TrackEntry => ({
	id: track.id,
	title: track.tag?.title ?? track.name,
	artist: track.tag?.artist ?? '?',
	genre: track.tag?.genres ? track.tag?.genres.join(' / ') : 'Podcast',
	album: podcastName ?? '?',
	podcastID,
	trackNr: track.date ? new Date(track.date).toDateString() : '',
	durationMS: track.duration ?? 0,
	duration: formatDuration(track.duration ?? undefined)
});

function transformData(data?: PodcastResultQuery): Podcast | undefined {
	if (!data) {
		return;
	}
	return {
		...data.podcast,
		description: data.podcast.description ?? undefined,
		episodes: (data.podcast.episodes ?? []).map(episode => transformPodcastEpisode(data.podcast.name, data.podcast.id, episode))
	};
}

function transformVariables(id: string): PodcastResultQueryVariables {
	return { id };
}

export const PodcastQuery: {
	query: DocumentNode;
	transformData: (d?: PodcastResultQuery, variables?: PodcastResultQueryVariables) => Podcast | undefined;
	transformVariables: (id: string) => PodcastResultQueryVariables;
} = { query: PodcastResultDocument, transformData, transformVariables };

export const useLazyPodcastQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; podcast?: Podcast; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<PodcastResultQuery, PodcastResultQueryVariables, Podcast>(PodcastQuery.query, PodcastQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({ id }, {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, podcast: data }];
};
