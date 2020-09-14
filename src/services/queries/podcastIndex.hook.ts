import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {PodcastIndexResult} from './types/PodcastIndexResult';
import {useCallback} from 'react';
import {PodcastIndexQuery} from './podcastIndex';

export const useLazyPodcastIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<PodcastIndexResult, void, Index>(PodcastIndexQuery.query, PodcastIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, index: data}];
};
