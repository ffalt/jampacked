/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlaylistIndexResult
// ====================================================

export interface PlaylistIndexResult_playlists_items {
  id: string;
  name: string;
  entriesCount: number;
}

export interface PlaylistIndexResult_playlists {
  items: PlaylistIndexResult_playlists_items[];
}

export interface PlaylistIndexResult {
  /**
   * Search Playlists
   */
  playlists: PlaylistIndexResult_playlists;
}
