import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {useCallback} from 'react';
import {PodcastIndexResult} from './types/PodcastIndexResult';
import {useCacheOrLazyQuery} from '../data';

const GET_PODCASTINDEX = gql`
    query PodcastIndexResult {
        podcasts {
            items {
                id
                name
                episodesCount
            }
        }
    }
`;

function transformData(data?: PodcastIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.podcasts.items.forEach(podcast => {
		index.push({
			id: podcast.id,
			objType: JamObjectType.podcast,
			desc: `Episodes: ${podcast.episodesCount}`,
			title: podcast.name,
			letter: podcast.name[0]
		});
	});
	return index;
}

export const useLazyPodcastIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<PodcastIndexResult, void, Index>(GET_PODCASTINDEX, transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			index: data
		}
	];
};
