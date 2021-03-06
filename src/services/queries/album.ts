import {TrackEntry} from '../types';
import {AlbumType} from '../jam';
import {formatDuration} from '../../utils/duration.utils';
import {AlbumResult, AlbumResult_album_tracks, AlbumResultVariables} from './types/AlbumResult';
import gql from 'graphql-tag';
import {DocumentNode} from 'graphql';

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

const formatTrack = (track: AlbumResult_album_tracks): TrackEntry => {
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
		tracks: data.album.tracks.map(track => formatTrack(track))
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

