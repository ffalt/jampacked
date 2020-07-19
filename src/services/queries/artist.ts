import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {AlbumType, JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {SectionListData} from 'react-native';
import {BaseEntry} from '../types';
import {useCallback, useEffect, useState} from 'react';
import {ArtistResult, ArtistResultVariables} from './types/ArtistResult';

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

export const useLazyArtistQuery = (): [(id: string) => void,
	{ loading: boolean, error?: ApolloError, artist?: Artist, called: boolean }
] => {
	const [artist, setArtist] = useState<Artist | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<ArtistResult, ArtistResultVariables>(GET_ARTIST);

	useEffect(() => {
		setArtist(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({variables: {id}});
	}, [query]);

	return [
		get,
		{
			loading,
			called,
			error,
			artist
		}
	];
};
