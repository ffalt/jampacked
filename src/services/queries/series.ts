import gql from 'graphql-tag';
import {AlbumType, JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {SectionListData} from 'react-native';
import {BaseEntry} from '../types';
import {useCallback, useEffect, useState} from 'react';
import {SeriesResult, SeriesResultVariables} from './types/SeriesResult';
import {useCacheOrLazyQuery} from '../data';

const GET_SERIES = gql`
    query SeriesResult($id: ID!) {
        series(id:$id) {
            id
            name
            artist {id name}
            tracksCount
            albums{
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

export interface Series {
	id: string;
	name: string;
	artistID?: string;
	artistName?: string;
	tracksCount: number;
	albums: Array<AlbumEntry>;
	sections: Array<SectionListData<BaseEntry>>;
}

function transformData(data?: SeriesResult): Series | undefined {
	if (!data) {
		return;
	}
	const sections: Array<SectionListData<BaseEntry>> = [];
	(data.series.albums || []).forEach(album => {
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
		albums: data.series.albums.map(series => {
			return {
				...series,
				year: series.year || undefined,
				seriesNr: series.seriesNr || undefined
			};
		}),
		sections
	};
}

export const useLazySeriesQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, series?: Series, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<SeriesResult, SeriesResultVariables, Series>(GET_SERIES, transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			series: data
		}
	];
};
