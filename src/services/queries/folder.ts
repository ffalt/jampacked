import gql from 'graphql-tag';
import {FolderType, JamObjectType} from '../jam';
import {BaseEntry, TrackEntry} from '../types';
import {formatDuration} from '../../utils/duration.utils';
import {ApolloError} from 'apollo-client';
import {useCallback, useEffect, useState} from 'react';
import {FolderResult, FolderResult_folder_tracks, FolderResultVariables} from './types/FolderResult';
import {useCacheOrLazyQuery} from '../data';

const GET_FOLDER = gql`
    query FolderResult($id: ID!) {
        folder(id:$id) {
            id
            title
            childrenCount
            tracksCount
            folderType
            artist
            genres
            children {
                id
                title
                folderType
            }
            tracks {
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
        }
    }
`;

interface FolderEntry {
	id: string;
	folderType: FolderType;
	title: string;
}

export interface ResultFolderTrack {
	id: string;
	name: string;
	album?: { id: string };
	artist?: { id: string };
	series?: { id: string };
	tag?: {
		mediaDuration: number;
		title?: string;
		artist?: string;
		genre?: string;
		album?: string;
		disc?: number;
		trackNr?: number;
	}
}

interface ResultFolder {
	id: string;
	title: string;
	childrenCount: number;
	tracksCount: number;
	folderType: FolderType;
	artist: string;
	genres: Array<string>;
	children: Array<FolderEntry>;
	tracks: Array<ResultFolderTrack>;
}

export interface FolderItem {
	id: string;
	folder?: BaseEntry;
	track?: TrackEntry;
}

export interface Folder {
	id: string;
	title?: string;
	folderCount?: number;
	trackCount?: number;
	type?: FolderType;
	artist?: string;
	genres?: Array<string>;
	items: Array<FolderItem>;
	tracks: Array<TrackEntry>;
}

export const formatTrack = (track: FolderResult_folder_tracks): TrackEntry => {
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

function transformData(data?: FolderResult): Folder | undefined {
	if (!data) {
		return;
	}
	const folders: Array<FolderItem> = (data.folder.children || [])
		.map(f => ({id: f.id, folder: {id: f.id, objType: JamObjectType.folder, title: f.title || '', desc: f.folderType || ''}}));

	const tracks = (data.folder.tracks || []).map(track => formatTrack(track));
	const trackItems: Array<FolderItem> = tracks.map(track => ({track, id: track.id}));

	return {
		id: data.folder.id,
		title: data.folder.title,
		folderCount: data.folder.childrenCount,
		trackCount: data.folder.tracksCount,
		type: data.folder.folderType,
		artist: data.folder.artist || undefined,
		genres: data.folder.genres,
		items: folders.concat(trackItems),
		tracks
	};
}

export const useLazyFolderQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, folder?: Folder, called: boolean }
] => {
	const [folder, setFolder] = useState<Folder | undefined>(undefined);
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<FolderResult, FolderResultVariables>(GET_FOLDER);

	useEffect(() => {
		setFolder(transformData(data));
	}, [data]);

	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);

	return [
		get,
		{
			loading,
			called,
			error,
			folder
		}
	];
};
