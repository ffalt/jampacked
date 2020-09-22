/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GenreIndexResult
// ====================================================

export interface GenreIndexResult_genreIndex_groups_items {
  name: string;
  albumCount: number;
  artistCount: number;
  trackCount: number;
}

export interface GenreIndexResult_genreIndex_groups {
  name: string;
  items: GenreIndexResult_genreIndex_groups_items[];
}

export interface GenreIndexResult_genreIndex {
  groups: GenreIndexResult_genreIndex_groups[];
}

export interface GenreIndexResult {
  /**
   * Get the Navigation Index for Genres
   */
  genreIndex: GenreIndexResult_genreIndex;
}
