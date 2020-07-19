/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchSeriesResult
// ====================================================

export interface SearchSeriesResult_serieses_items {
  id: string;
  name: string;
  albumsCount: number;
}

export interface SearchSeriesResult_serieses {
  total: number;
  skip: number | null;
  items: SearchSeriesResult_serieses_items[];
}

export interface SearchSeriesResult {
  /**
   * Search Series
   */
  serieses: SearchSeriesResult_serieses;
}

export interface SearchSeriesResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
