import {AlbumType, ListType, JamObjectType} from '../jam';
import {BaseEntryList, UseListCallFunctionTransform, useListFunction} from '../types';
import {DocumentNode} from 'graphql';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {useCallback} from 'react';
import {SeriesListResultDocument, SeriesListResultQuery, SeriesListResultQueryVariables} from './seriesList.api';

function transformData(data?: SeriesListResultQuery, variables?: SeriesListResultQueryVariables): BaseEntryList | undefined {
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

const transformVariables: UseListCallFunctionTransform<SeriesListResultQueryVariables> =
	(albumTypes, listType, genreIDs, seed, take, skip) => {
		return {albumTypes, listType, genreIDs, skip, take, seed};
	};

export const SeriesListQuery: {
	query: DocumentNode;
	transformData: (d?: SeriesListResultQuery, variables?: SeriesListResultQueryVariables) => BaseEntryList | undefined;
	transformVariables: UseListCallFunctionTransform<SeriesListResultQueryVariables>;
} = {query: SeriesListResultDocument, transformData, transformVariables};

export const useLazySeriesListQuery: useListFunction = () => {
	const [query, {loading, error, data, called, queryID}] =
		useCacheOrLazyQuery<SeriesListResultQuery, SeriesListResultQueryVariables, BaseEntryList>(SeriesListQuery.query, SeriesListQuery.transformData);
	const get = useCallback((
		albumTypes: Array<AlbumType>, listType: ListType | undefined,
		genreIDs: Array<string>, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean
	): void => {
		query({variables: SeriesListQuery.transformVariables(albumTypes, listType, genreIDs, seed, take, skip)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, data, queryID}];
};
