import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList} from '../types';
import {SeriesListResult, SeriesListResultVariables} from './types/SeriesListResult';
import {DocumentNode} from 'graphql';

const GET_SERIESLIST = gql`
    query SeriesListResult($listType: ListType!, $seed: String, $albumTypes: [AlbumType!], $take: Int!, $skip: Int!) {
        serieses(list: $listType, seed: $seed, filter: {albumTypes: $albumTypes}, page: {take: $take, skip: $skip}) {
            total
            skip
            take
            items {
                id
                name
                albumsCount
            }
        }
    }
`;

function transformData(data?: SeriesListResult, variables?: SeriesListResultVariables): BaseEntryList | undefined {
	if (!data) {
		return;
	}
	const result: BaseEntryList = {
		total: data.serieses.total,
		skip: data.serieses.skip === null ? undefined : data.serieses.skip,
		take: data.serieses.take === null ? undefined : data.serieses.take,
		listType: !variables?.listType ? undefined : variables.listType,
		items: []
	};
	data.serieses.items.forEach(entry => {
		result.items.push({
			id: entry.id,
			objType: JamObjectType.series,
			desc: `Episodes: ${entry.albumsCount}`,
			title: entry.name
		});
	});
	return result;
}

function transformVariables(albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number): SeriesListResultVariables {
	return {albumTypes, listType, skip, take, seed};
}

export const SeriesListQuery: {
	query: DocumentNode;
	transformData: (d?: SeriesListResult, variables?: SeriesListResultVariables) => BaseEntryList | undefined;
	transformVariables: (albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number) => SeriesListResultVariables;
} = {query: GET_SERIESLIST, transformData, transformVariables};

