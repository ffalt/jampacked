import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {TrackEntry} from '../types';
import {ApolloError} from 'apollo-client';
import {formatDuration} from '../../utils/duration.utils';
import {useCallback, useEffect, useState} from 'react';
import {PodcastResult, PodcastResult_podcast_episodes, PodcastResultVariables} from './types/PodcastResult';

const GET_PODCAST = gql`
    query PodcastResult($id: ID!) {
        podcast(id:$id) {
            id
            name
            description
            episodes {
                id
                name
                date
                duration
                tag {
                    title
                    artist
                }
            }
        }
    }
`;

export interface Podcast {
	id: string;
	name: string;
	description?: string;
	episodes: Array<TrackEntry>;
}

const formatTrack = (parent: PodcastResult, track: PodcastResult_podcast_episodes): TrackEntry => {
	return {
		id: track.id,
		title: track.tag?.title || track.name,
		artist: track.tag?.artist || '?',
		genre: 'Podcast',
		album: parent.podcast.name || '?',
		podcastID: parent.podcast.id,
		trackNr: track.date ? new Date(track.date).toDateString() : '',
		durationMS: track.duration || 0,
		duration: formatDuration(track.duration || undefined)
	};
};

function transformData(data?: PodcastResult): Podcast | undefined {
	if (!data) {
		return;
	}
	return {
		...data.podcast,
		description: data.podcast.description || undefined,
		episodes: (data.podcast.episodes || []).map(episode => formatTrack(data, episode))
	};
}

export const useLazyPodcastQuery = (): [(id: string) => void,
	{ loading: boolean, error?: ApolloError, podcast?: Podcast, called: boolean }
] => {
	const [podcast, setPodcast] = useState<Podcast | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<PodcastResult, PodcastResultVariables>(GET_PODCAST);

	useEffect(() => {
		setPodcast(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({variables: {id}});
	}, [query]);

	return [
		get,
		{
			loading,
			called,
			error,
			podcast
		}
	];
};
