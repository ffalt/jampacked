import { AlbumType, JamObjectType } from '../jam';
import { SectionListData } from 'react-native';
import { BaseEntry } from '../types';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { SeriesResultDocument, SeriesResultQuery, SeriesResultQueryVariables } from './series.api';

export interface AlbumEntry {
	id: string;
	name: string;
	albumType: AlbumType;
	year?: number;
	seriesNr?: string;
}

export interface Series {
	id: string;
	name: string;
	artistID?: string;
	artistName?: string;
	tracksCount: number;
	albums: Array<AlbumEntry>;
	sections: Array<SectionListData<BaseEntry>>;
}

function transformData(data?: SeriesResultQuery): Series | undefined {
	if (!data) {
		return;
	}
	const sections: Array<SectionListData<BaseEntry>> = [];
	(data.series.albums || []).forEach((album) => {
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
		id: data.series.id,
		name: data.series.name,
		artistID: data.series.artist?.id,
		artistName: data.series.artist?.name,
		tracksCount: data.series.tracksCount,
		albums: data.series.albums.map((series) => {
			return {
				...series,
				year: series.year || undefined,
				seriesNr: series.seriesNr || undefined
			};
		}),
		sections
	};
}

function transformVariables(id: string): SeriesResultQueryVariables {
	return { id };
}

export const SeriesQuery: {
	query: DocumentNode;
	transformData: (d?: SeriesResultQuery, variables?: SeriesResultQueryVariables) => Series | undefined;
	transformVariables: (id: string) => SeriesResultQueryVariables;
} = { query: SeriesResultDocument, transformData, transformVariables };

export const useLazySeriesQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; series?: Series; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<SeriesResultQuery, SeriesResultQueryVariables, Series>(SeriesQuery.query, SeriesQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({ variables: SeriesQuery.transformVariables(id) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, series: data }];
};
