import {AlbumType, JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {Index} from '../types';
import {ArtistIndexResult, ArtistIndexResultVariables} from './types/ArtistIndexResult';
import {DocumentNode} from 'graphql';

const GET_ARTISTINDEX = gql`
    query ArtistIndexResult($albumTypes: [AlbumType!]) {
        artistIndex(filter: {albumTypes: $albumTypes}) {
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

function transformData(data?: ArtistIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.artistIndex.groups.forEach(group => {
		group.items.forEach(entry => {
			index.push({
				id: entry.id,
				objType: JamObjectType.artist,
				desc: `Albums: ${entry.albumsCount}`,
				title: entry.name,
				letter: group.name
			});
		});
	});
	return index;
}

function transformVariables(albumTypes: Array<AlbumType>): ArtistIndexResultVariables {
	return {albumTypes};
}

export const ArtistIndexQuery: {
	query: DocumentNode;
	transformData: (d?: ArtistIndexResult, variables?: ArtistIndexResultVariables) => Index | undefined;
	transformVariables: (albumTypes: Array<AlbumType>) => ArtistIndexResultVariables;
} = {query: GET_ARTISTINDEX, transformData, transformVariables};
