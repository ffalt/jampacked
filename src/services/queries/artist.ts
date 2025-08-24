import { AlbumType, JamObjectType } from '../jam';
import { SectionListData } from 'react-native';
import { BaseEntry } from '../types';
import { DocumentNode } from 'graphql';
import type { ErrorLike } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { ArtistResultDocument, ArtistResultQuery, ArtistResultQueryVariables } from './artist.api';

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

function transformData(data?: ArtistResultQuery): Artist | undefined {
	if (!data) {
		return;
	}
	const sections: Array<SectionListData<BaseEntry>> = [];
	for (const album of (data.artist.albums || [])) {
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
		section.data = [...section.data, {
			objType: JamObjectType.album,
			id: album.id,
			title: album.name,
			desc
		}];
	}
	return {
		...data.artist,
		genres: (data.artist.genres ?? []).map(g => g.name),
		albums: data.artist.albums.map(a => ({
			...a,
			year: a.year ?? undefined,
			seriesNr: a.seriesNr ?? undefined
		})),
		sections
	};
}

function transformVariables(id: string): ArtistResultQueryVariables {
	return { id };
}

export const ArtistQuery: {
	query: DocumentNode;
	transformData: (d?: ArtistResultQuery, variables?: ArtistResultQueryVariables) => Artist | undefined;
	transformVariables: (id: string) => ArtistResultQueryVariables;
} = { query: ArtistResultDocument, transformData, transformVariables };

export const useLazyArtistQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ErrorLike; artist?: Artist; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<ArtistResultQuery, ArtistResultQueryVariables, Artist>(ArtistQuery.query, ArtistQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query(ArtistQuery.transformVariables(id), {}, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, artist: data }];
};
