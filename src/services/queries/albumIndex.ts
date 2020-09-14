import {AlbumType, JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {Index} from '../types';
import {AlbumIndexResult, AlbumIndexResultVariables} from './types/AlbumIndexResult';
import {DocumentNode} from 'graphql';

const GET_ALBUMINDEX = gql`
    query AlbumIndexResult($albumTypes: [AlbumType!]) {
        albumIndex(filter: {albumTypes: $albumTypes}) {
            groups {
                name
                items {
                    id
                    name
                    artist {
                        name
                    }
                }
            }
        }
    }
`;

function transformData(data?: AlbumIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.albumIndex.groups.forEach(group => {
		group.items.forEach(entry => {
			index.push({
				id: entry.id,
				objType: JamObjectType.album,
				desc: entry.artist?.name,
				title: entry.name,
				letter: group.name
			});
		});
	});
	return index;
}

function transformVariables(albumTypes: Array<AlbumType>): AlbumIndexResultVariables {
	return {albumTypes};
}

export const AlbumIndexQuery: {
	query: DocumentNode;
	transformData: (d?: AlbumIndexResult, variables?: AlbumIndexResultVariables) => Index | undefined;
	transformVariables: (albumTypes: Array<AlbumType>) => AlbumIndexResultVariables;
} = {query: GET_ALBUMINDEX, transformData, transformVariables};
