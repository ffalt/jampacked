import {ListType} from '../jam';
import gql from 'graphql-tag';
import {TrackEntryList} from '../types';
import {TrackListResult, TrackListResultVariables} from './types/TrackListResult';
import {DocumentNode} from 'graphql';
import {transformTrack} from './track';

const GET_TRACKLIST = gql`
    query TrackListResult($listType: ListType, $genreIDs: [ID!], $seed: String, $take: Int!, $skip: Int!) {
        tracks(list: $listType, filter: {genreIDs: $genreIDs}, seed: $seed, page: {take: $take, skip: $skip}) {
            total
            skip
            take
            items {
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

function transformData(data?: TrackListResult, variables?: TrackListResultVariables): TrackEntryList | undefined {
	if (!data) {
		return;
	}
	const result: TrackEntryList = {
		total: data.tracks.total,
		skip: data.tracks.skip === null ? undefined : data.tracks.skip,
		take: data.tracks.take === null ? undefined : data.tracks.take,
		listType: !variables?.listType ? undefined : variables.listType,
		items: []
	};
	data.tracks.items.forEach(entry => {
		result.items.push(transformTrack(entry));
	});
	return result;
}

function transformVariables(listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number): TrackListResultVariables {
	return {listType, genreIDs, skip, take, seed};
}

export const TrackListQuery: {
	query: DocumentNode;
	transformData: (d?: TrackListResult, variables?: TrackListResultVariables) => TrackEntryList | undefined;
	transformVariables: (listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number) => TrackListResultVariables;
} = {query: GET_TRACKLIST, transformData, transformVariables};

