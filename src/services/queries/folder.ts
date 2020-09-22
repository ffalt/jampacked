import gql from 'graphql-tag';
import {FolderType, JamObjectType} from '../jam';
import {BaseEntry, TrackEntry} from '../types';
import {formatDuration} from '../../utils/duration.utils';
import {FolderResult, FolderResult_folder_tracks, FolderResultVariables} from './types/FolderResult';
import {DocumentNode} from 'graphql';

const GET_FOLDER = gql`
    query FolderResult($id: ID!) {
        folder(id:$id) {
            id
            title
            childrenCount
            tracksCount
            folderType
            artist
            genres {
                id
                name
            }
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
		title: data.folder.title || undefined,
		folderCount: data.folder.childrenCount,
		trackCount: data.folder.tracksCount,
		type: data.folder.folderType,
		artist: data.folder.artist || undefined,
		genres: (data.folder.genres || []).map(g => g.name),
		items: folders.concat(trackItems),
		tracks
	};
}

function transformVariables(id: string): FolderResultVariables {
	return {id};
}

export const FolderQuery: {
	query: DocumentNode;
	transformData: (d?: FolderResult, variables?: FolderResultVariables) => Folder | undefined;
	transformVariables: (id: string) => FolderResultVariables;
} = {query: GET_FOLDER, transformData, transformVariables};
