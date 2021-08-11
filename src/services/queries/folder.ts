import gql from 'graphql-tag';
import {FolderType, JamObjectType} from '../jam';
import {BaseEntry, TrackEntry} from '../types';
import {formatDuration} from '../../utils/duration.utils';
import {FolderResult, FolderResult_folder_tracks, FolderResultVariables} from './types/FolderResult';
import {DocumentNode} from 'graphql';
import {transformTrack} from './track';

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
                    name
                }
                artist {
                    id
                    name
                }
                series {
                    id
                    name
                }
                genres {
                    id
                    name
                }
                tag {
                    mediaDuration
                    title
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


function transformData(data?: FolderResult): Folder | undefined {
	if (!data) {
		return;
	}
	const folders: Array<FolderItem> = (data.folder.children || [])
		.map(f => ({id: f.id, folder: {id: f.id, objType: JamObjectType.folder, title: f.title || '', desc: f.folderType || ''}}));

	const tracks = (data.folder.tracks || []).map(track => transformTrack(track));
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
