/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AutocompleteResult
// ====================================================

export interface AutocompleteResult_albums_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_albums {
  total: number;
  items: AutocompleteResult_albums_items[];
}

export interface AutocompleteResult_artists_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_artists {
  total: number;
  items: AutocompleteResult_artists_items[];
}

export interface AutocompleteResult_serieses_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_serieses {
  total: number;
  items: AutocompleteResult_serieses_items[];
}

export interface AutocompleteResult_podcasts_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_podcasts {
  total: number;
  items: AutocompleteResult_podcasts_items[];
}

export interface AutocompleteResult_episodes_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_episodes {
  total: number;
  items: AutocompleteResult_episodes_items[];
}

export interface AutocompleteResult_folders_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_folders {
  total: number;
  items: AutocompleteResult_folders_items[];
}

export interface AutocompleteResult_playlists_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_playlists {
  total: number;
  items: AutocompleteResult_playlists_items[];
}

export interface AutocompleteResult_tracks_items {
  id: string;
  name: string;
}

export interface AutocompleteResult_tracks {
  total: number;
  items: AutocompleteResult_tracks_items[];
}

export interface AutocompleteResult {
  /**
   * Search albums
   */
  albums: AutocompleteResult_albums;
  /**
   * Search Artists
   */
  artists: AutocompleteResult_artists;
  /**
   * Search Series
   */
  serieses: AutocompleteResult_serieses;
  /**
   * Search Podcasts
   */
  podcasts: AutocompleteResult_podcasts;
  /**
   * Search Episodes
   */
  episodes: AutocompleteResult_episodes;
  /**
   * Search Folders
   */
  folders: AutocompleteResult_folders;
  /**
   * Search Playlists
   */
  playlists: AutocompleteResult_playlists;
  tracks: AutocompleteResult_tracks;
}

export interface AutocompleteResultVariables {
  query: string;
}
