/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchAlbumsResult
// ====================================================

export interface SearchAlbumsResult_albums_items_artist {
  name: string;
}

export interface SearchAlbumsResult_albums_items {
  id: string;
  name: string;
  artist: SearchAlbumsResult_albums_items_artist;
}

export interface SearchAlbumsResult_albums {
  total: number;
  skip: number | null;
  items: SearchAlbumsResult_albums_items[];
}

export interface SearchAlbumsResult {
  /**
   * Search albums
   */
  albums: SearchAlbumsResult_albums;
}

export interface SearchAlbumsResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
