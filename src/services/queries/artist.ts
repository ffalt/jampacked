import gql from 'graphql-tag';
import {AlbumType, JamObjectType} from '../jam';
import {SectionListData} from 'react-native';
import {BaseEntry} from '../types';
import {ArtistResult, ArtistResultVariables} from './types/ArtistResult';
import {DocumentNode} from 'graphql';

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

function transformVariables(id: string): ArtistResultVariables {
	return {id};
}

export const ArtistQuery: {
	query: DocumentNode;
	transformData: (d?: ArtistResult, variables?: ArtistResultVariables) => Artist | undefined;
	transformVariables: (id: string) => ArtistResultVariables;
} = {query: GET_ARTIST, transformData, transformVariables};
