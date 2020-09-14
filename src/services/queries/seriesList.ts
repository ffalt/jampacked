import {AlbumType, JamObjectType, ListType} from '../jam';
import gql from 'graphql-tag';
import {BaseEntryList, useListFunction} from '../types';
import {useCallback} from 'react';
import {SeriesListResult, SeriesListResultVariables} from './types/SeriesListResult';
import {getCacheOrQuery, useCacheOrLazyQuery} from '../cache-query';
import {JamApolloClient} from '../apollo';
import {FolderListResult, FolderListResultVariables} from './types/FolderListResult';

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

export async function getSeriesList(
	albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, client: JamApolloClient
): Promise<BaseEntryList | undefined> {
	return getCacheOrQuery<SeriesListResult, SeriesListResultVariables, BaseEntryList>(client, GET_SERIESLIST, {albumTypes, listType, skip, take, seed}, transformData);
}

export const useLazySeriesListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] = useCacheOrLazyQuery<SeriesListResult, SeriesListResultVariables, BaseEntryList>(GET_SERIESLIST, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, listType: ListType, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean): void => {
		query({variables: {albumTypes, listType, skip, take, seed}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
