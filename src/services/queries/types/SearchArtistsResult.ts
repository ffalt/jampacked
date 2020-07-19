/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchArtistsResult
// ====================================================

export interface SearchArtistsResult_artists_items {
  id: string;
  name: string;
  albumsCount: number;
}

export interface SearchArtistsResult_artists {
  total: number;
  skip: number | null;
  items: SearchArtistsResult_artists_items[];
}

export interface SearchArtistsResult {
  /**
   * Search Artists
   */
  artists: SearchArtistsResult_artists;
}

export interface SearchArtistsResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
