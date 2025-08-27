import { DocumentNode } from 'graphql';
import type { ErrorLike } from '@apollo/client';
import { JamObjectType } from '../jam';
import { useCallback, useEffect, useState } from 'react';
import {
	SearchAlbumsResultDocument,
	SearchAlbumsResultQuery,
	SearchAlbumsResultQueryVariables,
	SearchArtistsResultDocument,
	SearchArtistsResultQuery,
	SearchArtistsResultQueryVariables,
	SearchEpisodesResultDocument,
	SearchEpisodesResultQuery,
	SearchEpisodesResultQueryVariables,
	SearchFoldersResultDocument,
	SearchFoldersResultQuery,
	SearchFoldersResultQueryVariables,
	SearchPlaylistsResultDocument,
	SearchPlaylistsResultQuery,
	SearchPlaylistsResultQueryVariables,
	SearchPodcastsResultDocument,
	SearchPodcastsResultQuery,
	SearchPodcastsResultQueryVariables,
	SearchSeriesResultDocument,
	SearchSeriesResultQuery,
	SearchSeriesResultQueryVariables,
	SearchTracksResultDocument,
	SearchTracksResultQuery,
	SearchTracksResultQueryVariables
} from './search.api';
import { useLazyQuery } from '@apollo/client/react';
import { SearchResultData } from '../../types/search.ts';

interface SearchPage<T> {
	total: number;
	skip?: number | null;
	items: Array<T>;
}

interface SearchQueryResult {
	id: string;
	name: string;
}

type SearchVariable =
	SearchAlbumsResultQueryVariables & SearchArtistsResultQueryVariables &
	SearchSeriesResultQueryVariables & SearchEpisodesResultQueryVariables &
	SearchPodcastsResultQueryVariables & SearchPlaylistsResultQueryVariables &
	SearchFoldersResultQueryVariables & SearchTracksResultQueryVariables;

type SearchQueryResults = SearchAlbumsResultQuery & SearchArtistsResultQuery &
	SearchSeriesResultQuery & SearchEpisodesResultQuery & SearchPodcastsResultQuery &
	SearchPlaylistsResultQuery & SearchFoldersResultQuery & SearchTracksResultQuery;

type SearchAlbumsResult_albums_items = NonNullable<SearchAlbumsResultQuery>['albums']['items'][number];
type SearchArtistsResult_artists_items = NonNullable<SearchArtistsResultQuery>['artists']['items'][number];
type SearchSeriesResult_serieses_items = NonNullable<SearchSeriesResultQuery>['serieses']['items'][number];
type SearchFoldersResult_folders_items = NonNullable<SearchFoldersResultQuery>['folders']['items'][number];
type SearchPodcastsResult_podcasts_items = NonNullable<SearchPodcastsResultQuery>['podcasts']['items'][number];
type SearchTracksResult_tracks_items = NonNullable<SearchTracksResultQuery>['tracks']['items'][number];
type SearchEpisodesResult_episodes_items = NonNullable<SearchEpisodesResultQuery>['episodes']['items'][number];
type SearchPlaylistsResult_playlists_items = NonNullable<SearchPlaylistsResultQuery>['playlists']['items'][number];

function buildPage<T extends SearchQueryResult>(data: SearchPage<T>, objectType: JamObjectType, query: string, getDesc: (item: T) => string | undefined): SearchResultData {
	return {
		query,
		total: data.total,
		skip: data.skip ?? 0,
		entries: data.items.map(o => ({ id: o.id, title: o.name, desc: getDesc(o) ?? '', objType: objectType }))
	};
}

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
			let info: string;
			if ((o.tracksCount || 0) > 0) {
				info = `Tracks: ${o.tracksCount}`;
			} else {
				info = (o.childrenCount || 0) > 0 ? `Folder: ${o.childrenCount}` : '';
			}
			return `${o.folderType ?? ''} ${info}`;
		});
	}
	if (data.tracks) {
		return buildPage<SearchTracksResult_tracks_items>(data.tracks, JamObjectType.track, variables.query, o => o.tag?.artist ?? '');
	}
}

function getSearchQuery(objectType: JamObjectType): DocumentNode {
	switch (objectType) {
		case JamObjectType.folder: {
			return SearchFoldersResultDocument;
		}
		case JamObjectType.track: {
			return SearchTracksResultDocument;
		}
		case JamObjectType.playlist: {
			return SearchPlaylistsResultDocument;
		}
		case JamObjectType.podcast: {
			return SearchPodcastsResultDocument;
		}
		case JamObjectType.episode: {
			return SearchEpisodesResultDocument;
		}
		case JamObjectType.series: {
			return SearchSeriesResultDocument;
		}
		case JamObjectType.album: {
			return SearchAlbumsResultDocument;
		}
		case JamObjectType.artist: {
			return SearchArtistsResultDocument;
		}
		default: {
			throw new Error('Invalid Search Type');
		}
	}
}

export const useLazySearchQuery = (objectType: JamObjectType): [(query: string, take: number, skip: number) => void,
	{ loading: boolean; error?: ErrorLike; result?: SearchResultData; called: boolean }
] => {
	const [result, setResult] = useState<SearchResultData | undefined>(undefined);
	const [getSearch, { loading, error, data, variables, called }] = useLazyQuery<SearchQueryResults, SearchVariable>(getSearchQuery(objectType));

	useEffect(() => {
		if (data && variables) {
			setResult(transformData(data, variables));
		}
	}, [data, variables]);

	const get = useCallback((query: string, take: number, skip: number): void => {
		getSearch({ variables: { query, take, skip } }).catch(console.error);
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
