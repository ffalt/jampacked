import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {useEffect, useState} from 'react';
import {PlaylistIndexResult} from './types/PlaylistIndexResult';

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

export const useLazyPlaylistIndexQuery = (): [() => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<PlaylistIndexResult>(GET_PLAYLISTINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	return [
		query,
		{
			loading,
			error,
			called,
			index
		}
	];
};
