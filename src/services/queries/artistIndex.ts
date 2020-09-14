import {AlbumType, JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCallback} from 'react';
import {ArtistIndexResult, ArtistIndexResultVariables} from './types/ArtistIndexResult';
import {getCacheOrQuery, useCacheOrLazyQuery} from '../cache-query';
import {JamApolloClient} from '../apollo';

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

export async function getArtistIndex(albumTypes: Array<AlbumType>, client: JamApolloClient): Promise<Index | undefined> {
	return getCacheOrQuery<ArtistIndexResult, ArtistIndexResultVariables, Index>(client, GET_ARTISTINDEX, {albumTypes}, transformData);
}

export const useLazyArtistIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<ArtistIndexResult, ArtistIndexResultVariables, Index>(GET_ARTISTINDEX, transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, forceRefresh?: boolean): void => {
		query({variables: {albumTypes}}, forceRefresh);
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
