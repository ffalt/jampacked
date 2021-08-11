/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GenreResult
// ====================================================

export interface GenreResult_genre {
  id: string;
  name: string;
}

export interface GenreResult {
  /**
   * Get an Genre by Id
   */
  genre: GenreResult_genre;
}

export interface GenreResultVariables {
  id: string;
}
