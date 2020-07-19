import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {useEffect, useState} from 'react';
import {SeriesIndexResult} from './types/SeriesIndexResult';

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

export const useLazySeriesIndexQuery = (): [() => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<SeriesIndexResult>(GET_SERIESINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	return [
		query,
		{
			loading,
			error,
			called,
			index
		}
	];
};
