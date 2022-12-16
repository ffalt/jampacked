import {AlbumType, JamObjectType} from '../jam';
import {Index} from '../types';
import {DocumentNode} from 'graphql';
import {ApolloError} from '@apollo/client';
import {useCacheOrLazyQuery} from '../cache-hooks';
import {useCallback} from 'react';
import {ArtistIndexResultDocument, ArtistIndexResultQuery, ArtistIndexResultQueryVariables} from './artistIndex.api';

function transformData(data?: ArtistIndexResultQuery): Index | undefined {
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

function transformVariables(albumTypes: Array<AlbumType>): ArtistIndexResultQueryVariables {
	return {albumTypes};
}

export const ArtistIndexQuery: {
	query: DocumentNode;
	transformData: (d?: ArtistIndexResultQuery, variables?: ArtistIndexResultQueryVariables) => Index | undefined;
	transformVariables: (albumTypes: Array<AlbumType>) => ArtistIndexResultQueryVariables;
} = {query: ArtistIndexResultDocument, transformData, transformVariables};

export const useLazyArtistIndexQuery = (): [(albumTypes: Array<AlbumType>, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<ArtistIndexResultQuery, ArtistIndexResultQueryVariables, Index>(ArtistIndexQuery.query, ArtistIndexQuery.transformData);
	const get = useCallback((albumTypes: Array<AlbumType>, forceRefresh?: boolean): void => {
		query({variables: ArtistIndexQuery.transformVariables(albumTypes)}, forceRefresh);
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
