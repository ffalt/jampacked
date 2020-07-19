/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchPlaylistsResult
// ====================================================

export interface SearchPlaylistsResult_playlists_items {
  id: string;
  name: string;
  entriesCount: number;
}

export interface SearchPlaylistsResult_playlists {
  total: number;
  skip: number | null;
  items: SearchPlaylistsResult_playlists_items[];
}

export interface SearchPlaylistsResult {
  /**
   * Search Playlists
   */
  playlists: SearchPlaylistsResult_playlists;
}

export interface SearchPlaylistsResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
