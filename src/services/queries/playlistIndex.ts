import gql from 'graphql-tag';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {PlaylistIndexResult} from './types/PlaylistIndexResult';
import {DocumentNode} from 'graphql';

const GET_PLAYLISTINDEX = gql`
    query PlaylistIndexResult {
        playlists {
            items {
                id
                name
                entriesCount
            }
        }
    }
`;

function transformData(data?: PlaylistIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.playlists.items.forEach(playlist => {
		index.push({
			id: playlist.id,
			objType: JamObjectType.playlist,
			desc: `Tracks: ${playlist.entriesCount}`,
			title: playlist.name,
			letter: playlist.name[0]
		});
	});
	return index;
}

function transformVariables(): void {
	return;
}

export const PlaylistIndexQuery: {
	query: DocumentNode;
	transformData: (d?: PlaylistIndexResult, variables?: void) => Index | undefined;
	transformVariables: () => void;
} = {query: GET_PLAYLISTINDEX, transformData, transformVariables};
