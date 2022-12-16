import {TrackEntry} from '../types';
import {AlbumType} from '../jam';
import {DocumentNode} from 'graphql';
import {transformTrack} from './track';
import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {useCallback} from 'react';
import {AlbumResultDocument, AlbumResultQuery, AlbumResultQueryVariables} from './album.api';

export interface Album {
	id: string;
	name: string;
	albumType: AlbumType;
	artistName: string;
	artistID: string;
	trackCount: number;
	genres: Array<string>;
	tracks: Array<TrackEntry>;
}

function transformData(data?: AlbumResultQuery): Album | undefined {
	if (!data || !data.album) {
		return;
	}
	return {
		id: data.album.id,
		name: data.album.name,
		albumType: data.album.albumType,
		artistName: data.album.artist?.name || '',
		artistID: data.album.artist?.id || '',
		trackCount: data.album.tracksCount,
		genres: (data.album.genres || []).map(g => g.name),
		tracks: data.album.tracks.map(track => transformTrack(track))
	};
}

function transformVariables(id: string): AlbumResultQueryVariables {
	return {id};
}

export const AlbumQuery: {
	query: DocumentNode;
	transformData: (d?: AlbumResultQuery, variables?: AlbumResultQueryVariables) => Album | undefined;
	transformVariables: (id: string) => AlbumResultQueryVariables;
} = {query: AlbumResultDocument, transformData, transformVariables};

export const useLazyAlbumQuery = (): [
	(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, called: boolean, album?: Album }
] => {
	const [query, {loading, error, data, called}] =
		useCacheOrLazyQuery<AlbumResultQuery, AlbumResultQueryVariables, Album>(AlbumQuery.query, AlbumQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: AlbumQuery.transformVariables(id)}, forceRefresh);
	}, [query]);
	return [get, {loading, called, error, album: data}];
};
