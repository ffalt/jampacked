import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {useEffect, useState} from 'react';
import {PodcastIndexResult} from './types/PodcastIndexResult';

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

export const useLazyPodcastIndexQuery = (): [() => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<PodcastIndexResult>(GET_PODCASTINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	return [
		query,
		{
			loading,
			called,
			error,
			index
		}
	];
};
