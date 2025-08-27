import { JamObjectType } from '../jam';
import { DocumentNode } from 'graphql';
import { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache.hooks.ts';
import { useCallback } from 'react';
import { SeriesIndexResultDocument, SeriesIndexResultQuery } from './seriesIndex.api';
import { Index } from '../../types/indexes.ts';

function transformData(data?: SeriesIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	for (const group of data.seriesIndex.groups) {
		for (const entry of group.items) {
			index.push({
				id: entry.id,
				objType: JamObjectType.series,
				desc: `Episodes: ${entry.albumsCount}`,
				title: entry.name,
				letter: group.name
			});
		}
	}
	return index;
}

function transformVariables(): void {
	return;
}

export const SeriesIndexQuery: {
	query: DocumentNode;
	transformData: (d?: SeriesIndexResultQuery, variables?: {}) => Index | undefined;
	transformVariables: () => void;
} = { query: SeriesIndexResultDocument, transformData, transformVariables };

export const useLazySeriesIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] = useCacheOrLazyQuery<SeriesIndexResultQuery, {}, Index>(SeriesIndexQuery.query, SeriesIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, {}, forceRefresh);
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
