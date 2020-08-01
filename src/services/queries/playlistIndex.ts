import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {useCallback, useEffect, useState} from 'react';
import {PlaylistIndexResult} from './types/PlaylistIndexResult';
import {useCacheOrLazyQuery} from '../data';

const GET_PLAYLISTINDEX = gql`
    query PlaylistIndexResult {
        playlists {
            items {
                id
                name
                entriesCount
            }
        }
    }
`;

function transformData(data?: PlaylistIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.playlists.items.forEach(playlist => {
		index.push({
			id: playlist.id,
			objType: JamObjectType.playlist,
			desc: `Tracks: ${playlist.entriesCount}`,
			title: playlist.name,
			letter: playlist.name[0]
		});
	});
	return index;
}

export const useLazyPlaylistIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<PlaylistIndexResult>(GET_PLAYLISTINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);

	return [
		get,
		{
			loading,
			error,
			called,
			index
		}
	];
};
