import gql from 'graphql-tag';
import {TrackEntry} from '../types';
import {ApolloError} from 'apollo-client';
import {formatDuration} from '../../utils/duration.utils';
import {useCallback} from 'react';
import {PlaylistResult, PlaylistResult_playlist_entries_episode, PlaylistResult_playlist_entries_track, PlaylistResultVariables} from './types/PlaylistResult';
import {useCacheOrLazyQuery} from '../data';

const GET_PLAYLIST = gql`
    query PlaylistResult($id: ID!) {
        playlist(id:$id) {
            id
            name
            comment
            entries {
                track {
                    id
                    name
                    album {
                        id
                    }
                    artist {
                        id
                    }
                    series {
                        id
                    }
                    tag {
                        mediaDuration
                        title
                        artist
                        genres
                        album
                        disc
                        trackNr
                    }
                }
                episode {
                    id
                    name
                    podcast {
                        id
                    }
                    tag {
                        mediaDuration
                        title
                        artist
                        genres
                        album
                        disc
                        trackNr
                    }
                }
            }
        }
    }
`;

export const formatTrack = (track: PlaylistResult_playlist_entries_track): TrackEntry => {
	return {
		id: track.id,
		title: track.tag?.title || track.name,
		artist: track.tag?.artist || '?',
		genre: track.tag?.genres ? track.tag?.genres.join(' / ') : undefined,
		album: track.tag?.album || '?',
		albumID: track.album?.id,
		artistID: track.artist?.id,
		seriesID: track.series?.id,
		trackNr: (track.tag?.disc && track.tag?.disc > 1 ? `${track.tag?.disc}-` : '') + (track.tag?.trackNr || ''),
		durationMS: track.tag?.mediaDuration || 0,
		duration: formatDuration(track.tag?.mediaDuration || undefined)
	};
};

export const formatEpisode = (episode: PlaylistResult_playlist_entries_episode): TrackEntry => {
	return {
		id: episode.id,
		title: episode.tag?.title || episode.name,
		artist: episode.tag?.artist || '?',
		genre: episode.tag?.genres ? episode.tag?.genres.join(' / ') : undefined,
		album: episode.tag?.album || '?',
		podcastID: episode.podcast?.id,
		trackNr: (episode.tag?.disc && episode.tag?.disc > 1 ? `${episode.tag?.disc}-` : '') + (episode.tag?.trackNr || ''),
		durationMS: episode.tag?.mediaDuration || 0,
		duration: formatDuration(episode.tag?.mediaDuration || undefined)
	};
};

export interface Playlist {
	id: string;
	name: string;
	comment?: string;
	tracks: Array<TrackEntry>;
}

function transformData(data?: PlaylistResult): Playlist | undefined {
	if (!data) {
		return;
	}
	const tracks: Array<TrackEntry> = [];
	(data.playlist.entries || []).map(entry => {
		const item = entry.track ? formatTrack(entry.track) : (entry.episode ? formatEpisode(entry.episode) : undefined);
		if (item) {
			tracks.push(item);
		}
	});
	return {
		...data.playlist,
		comment: data.playlist.comment || undefined,
		tracks
	};
}

export const useLazyPlaylistQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, playlist?: Playlist, called: boolean }] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<PlaylistResult, PlaylistResultVariables, Playlist>(GET_PLAYLIST, transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			error,
			called,
			playlist: data
		}
	];
};
