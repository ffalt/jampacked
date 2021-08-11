import {GenreResult, GenreResultVariables} from './types/GenreResult';
import gql from 'graphql-tag';
import {DocumentNode} from 'graphql';

const GET_GENRE = gql`
    query GenreResult($id: ID!) {
        genre(id:$id) {
            id
            name
        }
    }
`;

export interface Genre {
	id: string;
	name: string;
}

function transformData(data?: GenreResult): Genre | undefined {
	if (!data || !data.genre) {
		return;
	}
	return {
		id: data.genre.id,
		name: data.genre.name,
	};
}

function transformVariables(id: string): GenreResultVariables {
	return {id};
}

export const GenreQuery: {
	query: DocumentNode;
	transformData: (d?: GenreResult, variables?: GenreResultVariables) => Genre | undefined;
	transformVariables: (id: string) => GenreResultVariables;
} = {query: GET_GENRE, transformData, transformVariables};

