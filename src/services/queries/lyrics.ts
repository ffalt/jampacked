import gql from 'graphql-tag';
import {TrackLyricsResult, TrackLyricsResultVariables} from './types/TrackLyricsResult';
import {DocumentNode} from 'graphql';

const GET_TRACKLYRICS = gql`
    query TrackLyricsResult($id: ID!) {
        track(id:$id) {
            id
            lyrics {
                lyrics
                source
            }
        }
    }
`;

export interface TrackLyrics {
	lyrics?: string;
	source?: string;
}

export const transformData = (data?: TrackLyricsResult): TrackLyrics | undefined => {
	return data ? {
		lyrics: data.track?.lyrics?.lyrics || undefined,
		source: data.track?.lyrics?.source || undefined
	} : undefined;
};

function transformVariables(id: string): TrackLyricsResultVariables {
	return {id};
}

export const TrackLyricsQuery: {
	query: DocumentNode;
	transformData: (d?: TrackLyricsResult, variables?: TrackLyricsResultVariables) => TrackLyrics | undefined;
	transformVariables: (id: string) => TrackLyricsResultVariables;
} = {query: GET_TRACKLYRICS, transformData, transformVariables};


