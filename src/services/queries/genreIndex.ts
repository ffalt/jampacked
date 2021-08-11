import {JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {Index} from '../types';
import {GenreIndexResult} from './types/GenreIndexResult';
import {DocumentNode} from 'graphql';

const GET_GENREINDEX = gql`
    query GenreIndexResult {
        genreIndex {
            groups {
                name
                items {
					id
                    name
                    albumCount
                    artistCount
                    trackCount
                }
            }
        }
    }
`;

function transformData(data?: GenreIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.genreIndex.groups.forEach(group => {
		group.items.forEach(entry => {
			index.push({
				id: entry.id,
				objType: JamObjectType.genre,
				desc: `Albums: ${entry.albumCount} - Artists: ${entry.artistCount} - Tracks: ${entry.trackCount}`,
				title: entry.name,
				letter: group.name,
			});
		});
	});
	return index;
}

function transformVariables(): void {
	return;
}

export const GenreIndexQuery: {
	query: DocumentNode;
	transformData: (d?: GenreIndexResult, variables?: void) => Index | undefined;
	transformVariables: () => void;
} = {query: GET_GENREINDEX, transformData, transformVariables};
