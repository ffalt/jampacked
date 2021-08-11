import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, UseListCallFunctionTransform} from '../types';
import {SeriesListResult, SeriesListResultVariables} from './types/SeriesListResult';
import {DocumentNode} from 'graphql';

const GET_SERIESLIST = gql`
    query SeriesListResult($listType: ListType, $seed: String, $albumTypes: [AlbumType!], $genreIDs: [ID!] $take: Int!, $skip: Int!) {
        serieses(list: $listType, seed: $seed, filter: {albumTypes: $albumTypes, genreIDs: $genreIDs}, page: {take: $take, skip: $skip}) {
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

const transformVariables: UseListCallFunctionTransform<SeriesListResultVariables> = (albumTypes, listType, genreIDs, seed, take, skip) => {
	return {albumTypes, listType, genreIDs, skip, take, seed};
};

export const SeriesListQuery: {
	query: DocumentNode;
	transformData: (d?: SeriesListResult, variables?: SeriesListResultVariables) => BaseEntryList | undefined;
	transformVariables: UseListCallFunctionTransform<SeriesListResultVariables>;
} = {query: GET_SERIESLIST, transformData, transformVariables};

