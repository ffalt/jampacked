import {AlbumType, JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCallback, useEffect, useState} from 'react';
import {ArtistIndexResult, ArtistIndexResultVariables} from './types/ArtistIndexResult';
import {useCacheOrLazyQuery} from '../data';

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

export const useLazyArtistIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<ArtistIndexResult, ArtistIndexResultVariables>(GET_ARTISTINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	const get = useCallback((albumTypes: Array<AlbumType>, forceRefresh?: boolean): void => {
		query({variables: {albumTypes}}, forceRefresh);
	}, [query]);

	return [
		get,
		{
			loading,
			called,
			error,
			index
		}
	];
};
