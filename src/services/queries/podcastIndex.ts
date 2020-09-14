import gql from 'graphql-tag';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {PodcastIndexResult} from './types/PodcastIndexResult';
import {DocumentNode} from 'graphql';

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

function transformVariables(): void {
	return;
}

export const PodcastIndexQuery: {
	query: DocumentNode;
	transformData: (d?: PodcastIndexResult, variables?: void) => Index | undefined;
	transformVariables: () => void;
} = {query: GET_PODCASTINDEX, transformData, transformVariables};
