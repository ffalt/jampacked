import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {PodcastResult, PodcastResultVariables} from './types/PodcastResult';
import {useCallback} from 'react';
import {Podcast, PodcastQuery} from './podcast';

export const useLazyPodcastQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, podcast?: Podcast, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<PodcastResult, PodcastResultVariables, Podcast>(PodcastQuery.query, PodcastQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, podcast: data}];
};
