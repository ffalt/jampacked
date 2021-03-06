import gql from 'graphql-tag';
import {AlbumType, JamObjectType} from '../jam';
import {SectionListData} from 'react-native';
import {BaseEntry} from '../types';
import {SeriesResult, SeriesResultVariables} from './types/SeriesResult';
import {DocumentNode} from 'graphql';

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

function transformVariables(id: string): SeriesResultVariables {
	return {id};
}

export const SeriesQuery: {
	query: DocumentNode;
	transformData: (d?: SeriesResult, variables?: SeriesResultVariables) => Series | undefined;
	transformVariables: (id: string) => SeriesResultVariables;
} = {query: GET_SERIES, transformData, transformVariables};
