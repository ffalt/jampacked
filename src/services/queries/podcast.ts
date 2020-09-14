import gql from 'graphql-tag';
import {TrackEntry} from '../types';
import {formatDuration} from '../../utils/duration.utils';
import {PodcastResult, PodcastResult_podcast_episodes, PodcastResultVariables} from './types/PodcastResult';
import {DocumentNode} from 'graphql';

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

function transformVariables(id: string): PodcastResultVariables {
	return {id};
}

export const PodcastQuery: {
	query: DocumentNode;
	transformData: (d?: PodcastResult, variables?: PodcastResultVariables) => Podcast | undefined;
	transformVariables: (id: string) => PodcastResultVariables;
} = {query: GET_PODCAST, transformData, transformVariables};

