import { Index } from '../types';
import { JamObjectType } from '../jam';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { PlaylistIndexResultDocument, PlaylistIndexResultQuery } from './playlistIndex.api';

function transformData(data?: PlaylistIndexResultQuery): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.playlists.items.forEach((playlist) => {
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

function transformVariables(): void {
	return;
}

export const PlaylistIndexQuery: {
	query: DocumentNode;
	transformData: (d?: PlaylistIndexResultQuery, variables?: void) => Index | undefined;
	transformVariables: () => void;
} = { query: PlaylistIndexResultDocument, transformData, transformVariables };

export const useLazyPlaylistIndexQuery = (): [(forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; index?: Index; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<PlaylistIndexResultQuery, void, Index>(PlaylistIndexQuery.query, PlaylistIndexQuery.transformData);
	const get = useCallback((forceRefresh?: boolean): void => {
		query({}, forceRefresh);
	}, [query]);
	return [get, { loading, error, called, index: data }];
};
