import {TrackEntry} from '../types';
import {AlbumType} from '../jam';
import {AlbumResult, AlbumResultVariables} from './types/AlbumResult';
import gql from 'graphql-tag';
import {DocumentNode} from 'graphql';
import {transformTrack} from './track';

const GET_ALBUM = gql`
    query AlbumResult($id: ID!) {
        album(id:$id) {
            id
            name
            albumType
            artist {
                id
                name
            }
            tracksCount
            genres {
                id
                name
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

export interface Album {
	id: string;
	name: string;
	albumType: AlbumType;
	artistName: string;
	artistID: string;
	trackCount: number;
	genres: Array<string>;
	tracks: Array<TrackEntry>;
}

function transformData(data?: AlbumResult): Album | undefined {
	if (!data || !data.album) {
		return;
	}
	return {
		id: data.album.id,
		name: data.album.name,
		albumType: data.album.albumType,
		artistName: data.album.artist?.name || '',
		artistID: data.album.artist?.id || '',
		trackCount: data.album.tracksCount,
		genres: (data.album.genres || []).map(g => g.name),
		tracks: data.album.tracks.map(track => transformTrack(track))
	};
}

function transformVariables(id: string): AlbumResultVariables {
	return {id};
}

export const AlbumQuery: {
	query: DocumentNode;
	transformData: (d?: AlbumResult, variables?: AlbumResultVariables) => Album | undefined;
	transformVariables: (id: string) => AlbumResultVariables;
} = {query: GET_ALBUM, transformData, transformVariables};

