import {TrackEntry} from '../types';
import {AlbumType} from '../jam';
import {formatDuration} from '../../utils/duration.utils';
import {ApolloError} from 'apollo-client';
import {useCallback} from 'react';
import {AlbumResult, AlbumResult_album_tracks, AlbumResultVariables} from './types/AlbumResult';
import gql from 'graphql-tag';
import {useCacheOrLazyQuery} from '../data';
import {apolloClient} from '../apollo';

const GET_ALBUM = gql`
    query AlbumResult($id: ID!) {
        album(id:$id) {
            id
            name
            albumType
            artist {
                id
                name
            }
            tracksCount
            genres
            tracks {
                id
                name
                album {
                    id
                }
                artist {
                    id
                }
                series {
                    id
                }
                tag {
                    mediaDuration
                    title
                    artist
                    genres
                    album
                    disc
                    trackNr
                }
            }
        }
    }
`;

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

const formatTrack = (track: AlbumResult_album_tracks): TrackEntry => {
	return {
		id: track.id,
		title: track.tag?.title || track.name,
		artist: track.tag?.artist || '?',
		genre: track.tag?.genres ? track.tag?.genres.join(' / ') : undefined,
		album: track.tag?.album || '?',
		albumID: track.album?.id,
		artistID: track.artist?.id,
		seriesID: track.series?.id,
		trackNr: (track.tag?.disc && track.tag?.disc > 1 ? `${track.tag?.disc}-` : '') + (track.tag?.trackNr || ''),
		durationMS: track.tag?.mediaDuration || 0,
		duration: formatDuration(track.tag?.mediaDuration || undefined)
	};
};

function transformData(data?: AlbumResult): Album | undefined {
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
		genres: data.album.genres,
		tracks: data.album.tracks.map(track => formatTrack(track))
	};
}

export async function getAlbum(id: string): Promise<Album | undefined> {
	const result = await apolloClient().query<AlbumResult>({query: GET_ALBUM, variables: {id}});
	return transformData(result?.data);
}

export const useLazyAlbumQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, album?: Album, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<AlbumResult, AlbumResultVariables, Album>(GET_ALBUM, transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({variables: {id}}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			album: data
		}
	];
};
