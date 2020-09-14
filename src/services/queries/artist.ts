import gql from 'graphql-tag';
import {AlbumType, JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {SectionListData} from 'react-native';
import {BaseEntry} from '../types';
import {useCallback} from 'react';
import {ArtistResult, ArtistResultVariables} from './types/ArtistResult';
import {getCacheOrQuery, useCacheOrLazyQuery} from '../cache-query';
import {JamApolloClient} from '../apollo';
import {AlbumResult, AlbumResultVariables} from './types/AlbumResult';
import {Album} from './album';

const GET_ARTIST = gql`
    query ArtistResult($id: ID!) {
        artist(id:$id) {
            id
            name
            albumsCount
            tracksCount
            genres
            albums {
                id
                name
                albumType
                seriesNr
                year
            }
        }
    }
`;

export interface AlbumEntry {
	id: string;
	name: string;
	albumType: AlbumType;
	year?: number;
	seriesNr?: string;
}

export interface Artist {
	id: string;
	name: string;
	genres: Array<string>;
	albumsCount: number;
	tracksCount: number;
	albums: Array<AlbumEntry>;
	sections: Array<SectionListData<BaseEntry>>;
}

function transformData(data?: ArtistResult): Artist | undefined {
	if (!data) {
		return;
	}
	const sections: Array<SectionListData<BaseEntry>> = [];
	(data.artist.albums || []).forEach(album => {
		let section = sections.find(s => s.key === album.albumType);
		if (!section) {
			section = {
				key: album.albumType,
				title: album.albumType,
				data: []
			};
			sections.push(section);
		}
		let desc = '';
		if (album.seriesNr) {
			desc = `Episode ${album.seriesNr}`;
		} else if (album.year) {
			desc = `${album.year}`;
		}
		section.data = section.data.concat([{
			objType: JamObjectType.album,
			id: album.id,
			title: album.name,
			desc
		}]);
	});
	return {
		...data.artist,
		albums: data.artist.albums.map(a => ({
			...a,
			year: a.year || undefined,
			seriesNr: a.seriesNr || undefined
		})),
		sections
	};
}

export async function getArtist(id: string, client: JamApolloClient): Promise<Artist | undefined> {
	return getCacheOrQuery<ArtistResult, ArtistResultVariables, Artist>(client, GET_ARTIST, {id}, transformData);
}

export const useLazyArtistQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, artist?: Artist, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<ArtistResult, ArtistResultVariables, Artist>(GET_ARTIST, transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			artist: data
		}
	];
};
