import { TrackEntry } from '../types';
import { formatDuration } from '../../utils/duration.utils';
import { DocumentNode } from 'graphql';
import { transformTrack } from './track';
import type { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { PlaylistResultDocument, PlaylistResultQuery, PlaylistResultQueryVariables } from './playlist.api';

export type PlaylistResult_playlist_entries_episode = NonNullable<PlaylistResultQuery>['playlist']['entries'][number]['episode'];

export interface Playlist {
	id: string;
	name: string;
	comment?: string;
	tracks: Array<TrackEntry>;
}

export const transformEpisode = (episode: PlaylistResult_playlist_entries_episode): TrackEntry | undefined => {
	if (!episode) {
		return undefined;
	}
	return {
		id: episode.id,
		title: episode.tag?.title ?? episode.name,
		artist: episode.tag?.artist ?? '?',
		genre: episode.tag?.genres ? episode.tag?.genres.join(' / ') : undefined,
		album: episode.tag?.album ?? '?',
		podcastID: episode.podcast?.id,
		trackNr: (episode.tag?.disc && episode.tag?.disc > 1 ? `${episode.tag?.disc}-` : '') + (episode.tag?.trackNr ?? ''),
		durationMS: episode.tag?.mediaDuration ?? 0,
		duration: formatDuration(episode.tag?.mediaDuration ?? undefined)
	};
};

function transformData(data?: PlaylistResultQuery): Playlist | undefined {
	if (!data) {
		return;
	}
	const tracks: Array<TrackEntry> = [];
	for (const entry of (data.playlist.entries ?? [])) {
		const item = entry.track ? transformTrack(entry.track) : transformEpisode(entry.episode);
		if (item) {
			tracks.push(item);
		}
	}
	return {
		...data.playlist,
		comment: data.playlist.comment ?? undefined,
		tracks
	};
}

function transformVariables(id: string): PlaylistResultQueryVariables {
	return { id };
}

export const PlaylistQuery: {
	query: DocumentNode;
	transformData: (d?: PlaylistResultQuery, variables?: PlaylistResultQueryVariables) => Playlist | undefined;
	transformVariables: (id: string) => PlaylistResultQueryVariables;
} = { query: PlaylistResultDocument, transformData, transformVariables };

export const useLazyPlaylistQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; playlist?: Playlist; called: boolean }] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<PlaylistResultQuery, PlaylistResultQueryVariables, Playlist>(PlaylistQuery.query, PlaylistQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query(PlaylistQuery.transformVariables(id), {}, forceRefresh);
	}, [query]);
	return [get, { loading, error, called, playlist: data }];
};
