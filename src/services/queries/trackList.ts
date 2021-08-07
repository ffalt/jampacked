import {ListType} from '../jam';
import gql from 'graphql-tag';
import {TrackEntryList} from '../types';
import {TrackListResult, TrackListResultVariables} from './types/TrackListResult';
import {DocumentNode} from 'graphql';
import {transformTrack} from './track';

const GET_TRACKLIST = gql`
    query TrackListResult($listType: ListType!, $seed: String, $take: Int!, $skip: Int!) {
        tracks(list: $listType, seed: $seed, page: {take: $take, skip: $skip}) {
            total
            skip
            take
            items {
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

function transformVariables(listType: ListType, seed: string | undefined, take: number, skip: number): TrackListResultVariables {
	return {listType, skip, take, seed};
}

export const TrackIndexQuery: {
	query: DocumentNode;
	transformData: (d?: TrackListResult, variables?: TrackListResultVariables) => TrackEntryList | undefined;
	transformVariables: (listType: ListType, seed: string | undefined, take: number, skip: number) => TrackListResultVariables;
} = {query: GET_TRACKLIST, transformData, transformVariables};

