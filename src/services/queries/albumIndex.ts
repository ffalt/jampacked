import {AlbumType, JamObjectType} from '../jam';
import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCallback} from 'react';
import {AlbumIndexResult, AlbumIndexResultVariables} from './types/AlbumIndexResult';
import {useCacheOrLazyQuery} from '../data';

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

export const useLazyAlbumIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<AlbumIndexResult, AlbumIndexResultVariables, Index>(GET_ALBUMINDEX, transformData);
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
