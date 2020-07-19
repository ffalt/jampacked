import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {useCallback, useEffect, useState} from 'react';
import {SearchResultData} from '../types';
import {SearchAlbumsResult, SearchAlbumsResult_albums_items, SearchAlbumsResultVariables} from './types/SearchAlbumsResult';
import {SearchArtistsResult, SearchArtistsResult_artists_items, SearchArtistsResultVariables} from './types/SearchArtistsResult';
import {SearchSeriesResult, SearchSeriesResult_serieses_items, SearchSeriesResultVariables} from './types/SearchSeriesResult';
import {SearchPodcastsResult, SearchPodcastsResult_podcasts_items, SearchPodcastsResultVariables} from './types/SearchPodcastsResult';
import {SearchEpisodesResult, SearchEpisodesResult_episodes_items, SearchEpisodesResultVariables} from './types/SearchEpisodesResult';
import {SearchPlaylistsResult, SearchPlaylistsResult_playlists_items, SearchPlaylistsResultVariables} from './types/SearchPlaylistsResult';
import {SearchFoldersResult, SearchFoldersResult_folders_items, SearchFoldersResultVariables} from './types/SearchFoldersResult';
import {SearchTracksResult, SearchTracksResult_tracks_items, SearchTracksResultVariables} from './types/SearchTracksResult';

const GET_SEARCH_TRACK = gql`
    query SearchTracksResult($query: String!, $take: Int, $skip: Int) {
        tracks(page:{take: $take, skip: $skip}, filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                tag {
                    artist
                }
            }
        }
    }
`;

const GET_SEARCH_SERIES = gql`
    query SearchSeriesResult($query: String!, $take: Int, $skip: Int) {
        serieses(page:{take: $take, skip: $skip},filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                albumsCount
            }
        }
    }
`;

const GET_SEARCH_PODCAST = gql`
    query SearchPodcastsResult($query: String!, $take: Int, $skip: Int) {
        podcasts(page:{take: $take, skip: $skip}, filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                episodesCount
            }
        }
    }
`;

const GET_SEARCH_PLAYLIST = gql`
    query SearchPlaylistsResult($query: String!, $take: Int, $skip: Int) {
        playlists(page:{take: $take, skip: $skip}, filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                entriesCount
            }
        }
    }
`;

const GET_SEARCH_FOLDERS = gql`
    query SearchFoldersResult($query: String!, $take: Int, $skip: Int) {
        folders(page:{take: $take, skip: $skip}, filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                folderType
                childrenCount
                tracksCount
            }
        }
    }
`;

const GET_SEARCH_EPISODES = gql`
    query SearchEpisodesResult($query: String!, $take: Int, $skip: Int) {
        episodes(page:{take: $take, skip: $skip}, filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                date
            }
        }
    }
`;

const GET_SEARCH_ARTIST = gql`
    query SearchArtistsResult($query: String!, $take: Int, $skip: Int) {
        artists(page:{take: $take, skip: $skip}, filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                albumsCount
            }
        }
    }
`;

const GET_SEARCH_ALBUM = gql`
    query SearchAlbumsResult($query: String!, $take: Int, $skip: Int) {
        albums(page:{take: $take, skip: $skip}, filter:{query:$query}) {
            total
            skip
            items {
                id
                name
                artist {
                    name
                }
            }
        }
    }
`;

interface SearchPage<T> {
	total: number;
	skip?: number | null;
	items: Array<T>;
}

interface SearchQueryResult {
	id: string;
	name: string;
}

function buildPage<T extends SearchQueryResult>(data: SearchPage<T>, objType: JamObjectType, query: string, getDesc: (item: T) => string | undefined): SearchResultData {
	return {
		query,
		total: data.total,
		skip: data.skip || 0,
		entries: data.items.map(o => ({id: o.id, title: o.name, desc: getDesc(o) || '', objType}))
	};
}

type SearchVariable =
	SearchAlbumsResultVariables & SearchArtistsResultVariables & SearchSeriesResultVariables & SearchEpisodesResultVariables &
	SearchPodcastsResultVariables & SearchPlaylistsResultVariables & SearchFoldersResultVariables & SearchTracksResultVariables;

type SearchQueryResults =
	SearchAlbumsResult & SearchArtistsResult & SearchSeriesResult & SearchEpisodesResult & SearchPodcastsResult &
	SearchPlaylistsResult & SearchFoldersResult & SearchTracksResult;

function transformData(data: SearchQueryResults | undefined, variables: SearchVariable): SearchResultData | undefined {
	if (!data) {
		return;
	}
	if (data.albums) {
		return buildPage<SearchAlbumsResult_albums_items>(data.albums, JamObjectType.album, variables.query, o => o.artist?.name);
	}
	if (data.artists) {
		return buildPage<SearchArtistsResult_artists_items>(data.artists, JamObjectType.artist, variables.query, o => `Albums: ${o.albumsCount}`);
	}
	if (data.serieses) {
		return buildPage<SearchSeriesResult_serieses_items>(data.serieses, JamObjectType.series, variables.query, o => `Episodes: ${o.albumsCount}`);
	}
	if (data.podcasts) {
		return buildPage<SearchPodcastsResult_podcasts_items>(data.podcasts, JamObjectType.podcast, variables.query, o => `Episodes: ${o.episodesCount}`);
	}
	if (data.episodes) {
		return buildPage<SearchEpisodesResult_episodes_items>(data.episodes, JamObjectType.episode, variables.query, o => o.date ? `${o.date.toString()}` : '');
	}
	if (data.playlists) {
		return buildPage<SearchPlaylistsResult_playlists_items>(data.playlists, JamObjectType.playlist, variables.query, o => `Tracks: ${o.entriesCount}`);
	}
	if (data.folders) {
		return buildPage<SearchFoldersResult_folders_items>(data.folders, JamObjectType.folder, variables.query, o => {
			return (o.folderType || '') + ' ' + (
				(o.tracksCount || 0) > 0 ? `Tracks: ${o.tracksCount}` :
					((o.childrenCount || 0) > 0 ? `Folder: ${o.childrenCount}` : '')
			);
		});
	}
	if (data.tracks) {
		return buildPage<SearchTracksResult_tracks_items>(data.tracks, JamObjectType.track, variables.query, o => o.tag?.artist || '');
	}
}

function getSearchQuery(objType: JamObjectType): any {
	switch (objType) {
		case JamObjectType.folder:
			return GET_SEARCH_FOLDERS;
		case JamObjectType.track:
			return GET_SEARCH_TRACK;
		case JamObjectType.playlist:
			return GET_SEARCH_PLAYLIST;
		case JamObjectType.podcast:
			return GET_SEARCH_PODCAST;
		case JamObjectType.episode:
			return GET_SEARCH_EPISODES;
		case JamObjectType.series:
			return GET_SEARCH_SERIES;
		case JamObjectType.album:
			return GET_SEARCH_ALBUM;
		case JamObjectType.artist:
			return GET_SEARCH_ARTIST;
	}
	throw new Error('Invalid Search Type');
}

export const useLazySearchQuery = (objType: JamObjectType): [(query: string, take: number, skip: number) => void,
	{ loading: boolean, error?: ApolloError, result?: SearchResultData, called: boolean }
] => {
	const [result, setResult] = useState<SearchResultData | undefined>(undefined);
	const [getSearch, {loading, error, data, variables, called}] = useLazyQuery<SearchQueryResults, SearchVariable>(getSearchQuery(objType));

	useEffect(() => {
		if (data) {
			setResult(transformData(data, variables));
		}
	}, [data, variables]);

	const get = useCallback((query: string, take: number, skip: number): void => {
		getSearch({variables: {query, take, skip}});
	}, [getSearch]);

	return [
		get,
		{
			loading,
			called,
			error,
			result
		}
	];
};
