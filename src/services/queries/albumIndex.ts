import {AlbumType, JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCallback, useEffect, useState} from 'react';
import {AlbumIndexResult, AlbumIndexResultVariables} from './types/AlbumIndexResult';

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

export const useLazyAlbumIndexQuery = (): [(albumTypes: Array<AlbumType>) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<AlbumIndexResult, AlbumIndexResultVariables>(GET_ALBUMINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	const get = useCallback( (albumTypes: Array<AlbumType>): void => {
		query({variables: {albumTypes}});
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
