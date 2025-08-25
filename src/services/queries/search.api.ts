// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type SearchTracksResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchTracksResultQuery {
	tracks: {
		total: number;
		skip?: number | null;
		items: Array<{
			id: string;
			name: string;
			tag?: { artist?: string | null } | null;
		}>;
	};
}

export type SearchSeriesResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchSeriesResultQuery {
	serieses: {
		total: number;
		skip?: number | null;
		items: Array<{ id: string; name: string; albumsCount: number }>;
	};
}

export type SearchPodcastsResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchPodcastsResultQuery {
	podcasts: {
		total: number;
		skip?: number | null;
		items: Array<{ id: string; name: string; episodesCount: number }>;
	};
}

export type SearchPlaylistsResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchPlaylistsResultQuery {
	playlists: {
		total: number;
		skip?: number | null;
		items: Array<{ id: string; name: string; entriesCount: number }>;
	};
}

export type SearchFoldersResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchFoldersResultQuery {
	folders: {
		total: number;
		skip?: number | null;
		items: Array<{
			id: string;
			name: string;
			folderType: Types.FolderType;
			childrenCount: number;
			tracksCount: number;
		}>;
	};
}

export type SearchEpisodesResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchEpisodesResultQuery {
	episodes: {
		total: number;
		skip?: number | null;
		items: Array<{ id: string; name: string; date: string }>;
	};
}

export type SearchArtistsResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchArtistsResultQuery {
	artists: {
		total: number;
		skip?: number | null;
		items: Array<{ id: string; name: string; albumsCount: number }>;
	};
}

export type SearchAlbumsResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
	take?: Types.InputMaybe<Types.Scalars['Int']['input']>;
	skip?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface SearchAlbumsResultQuery {
	albums: {
		total: number;
		skip?: number | null;
		items: Array<{ id: string; name: string; artist: { name: string } }>;
	};
}

export const SearchTracksResultDocument = gql`
  query SearchTracksResult($query: String!, $take: Int, $skip: Int) {
  	tracks(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchTracksResultQueryResult = useQuery.Result<
	SearchTracksResultQuery,
	SearchTracksResultQueryVariables
>;
export const SearchSeriesResultDocument = gql`
  query SearchSeriesResult($query: String!, $take: Int, $skip: Int) {
  	serieses(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchSeriesResultQueryResult = useQuery.Result<
	SearchSeriesResultQuery,
	SearchSeriesResultQueryVariables
>;
export const SearchPodcastsResultDocument = gql`
  query SearchPodcastsResult($query: String!, $take: Int, $skip: Int) {
  	podcasts(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchPodcastsResultQueryResult = useQuery.Result<
	SearchPodcastsResultQuery,
	SearchPodcastsResultQueryVariables
>;
export const SearchPlaylistsResultDocument = gql`
  query SearchPlaylistsResult($query: String!, $take: Int, $skip: Int) {
  	playlists(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchPlaylistsResultQueryResult = useQuery.Result<
	SearchPlaylistsResultQuery,
	SearchPlaylistsResultQueryVariables
>;
export const SearchFoldersResultDocument = gql`
  query SearchFoldersResult($query: String!, $take: Int, $skip: Int) {
  	folders(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchFoldersResultQueryResult = useQuery.Result<
	SearchFoldersResultQuery,
	SearchFoldersResultQueryVariables
>;
export const SearchEpisodesResultDocument = gql`
  query SearchEpisodesResult($query: String!, $take: Int, $skip: Int) {
  	episodes(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchEpisodesResultQueryResult = useQuery.Result<
	SearchEpisodesResultQuery,
	SearchEpisodesResultQueryVariables
>;
export const SearchArtistsResultDocument = gql`
  query SearchArtistsResult($query: String!, $take: Int, $skip: Int) {
  	artists(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchArtistsResultQueryResult = useQuery.Result<
	SearchArtistsResultQuery,
	SearchArtistsResultQueryVariables
>;
export const SearchAlbumsResultDocument = gql`
  query SearchAlbumsResult($query: String!, $take: Int, $skip: Int) {
  	albums(page: { take: $take, skip: $skip }, filter: { query: $query }) {
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
export type SearchAlbumsResultQueryResult = useQuery.Result<
	SearchAlbumsResultQuery,
	SearchAlbumsResultQueryVariables
>;
