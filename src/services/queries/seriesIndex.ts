import gql from 'graphql-tag';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {useCallback, useEffect, useState} from 'react';
import {SeriesIndexResult} from './types/SeriesIndexResult';
import {useCacheOrLazyQuery} from '../data';

const GET_SERIESINDEX = gql`
    query SeriesIndexResult {
        seriesIndex {
            groups {
                name
                items {
                    id
                    name
                    albumsCount
                }
            }
        }
    }
`;

function transformData(data?: SeriesIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.seriesIndex.groups.forEach(group => {
		group.items.forEach(entry => {
			index.push({
				id: entry.id,
				objType: JamObjectType.series,
				desc: `Episodes: ${entry.albumsCount}`,
				title: entry.name,
				letter: group.name
			});
		});
	});
	return index;
}

export const useLazySeriesIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<SeriesIndexResult, any, Index>(GET_SERIESINDEX, transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			error,
			called,
			index: data
		}
	];
};
