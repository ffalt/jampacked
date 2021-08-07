import gql from 'graphql-tag';
import {TrackEntry} from '../types';
import {formatDuration} from '../../utils/duration.utils';
import {TrackResult, TrackResult_track, TrackResultVariables} from './types/TrackResult';
import {DocumentNode} from 'graphql';

const GET_TRACK = gql`
    query TrackResult($id: ID!) {
        track(id:$id) {
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
            genres {
                id
                name
            }
            tag {
                mediaDuration
                title
                artist
                album
                disc
                trackNr
            }
        }
    }
`;

export const transformTrack = (track: TrackResult_track): TrackEntry => {
	return {
		id: track.id,
		title: track.tag?.title || track.name,
		artist: track.tag?.artist || '?',
		genre: track.genres?.length ? (track.genres || []).map(g => g.name).join(' / ') : undefined,
		album: track.tag?.album || '?',
		albumID: track.album?.id,
		artistID: track.artist?.id,
		seriesID: track.series?.id,
		trackNr: (track.tag?.disc && track.tag?.disc > 1 ? `${track.tag?.disc}-` : '') + (track.tag?.trackNr || ''),
		durationMS: track.tag?.mediaDuration || 0,
		duration: formatDuration(track.tag?.mediaDuration || undefined)
	};
};

export const transformData = (data?: TrackResult): TrackEntry | undefined => {
	if (!data) {
		return;
	}
	const {track} = data;
	return transformTrack(track);
};

function transformVariables(id: string): TrackResultVariables {
	return {id};
}

export const TrackQuery: {
	query: DocumentNode;
	transformData: (d?: TrackResult, variables?: TrackResultVariables) => TrackEntry | undefined;
	transformVariables: (id: string) => TrackResultVariables;
} = {query: GET_TRACK, transformData, transformVariables};

