/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListType, AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: SeriesListResult
// ====================================================

export interface SeriesListResult_serieses_items {
  id: string;
  name: string;
  albumsCount: number;
}

export interface SeriesListResult_serieses {
  total: number;
  skip: number | null;
  take: number | null;
  items: SeriesListResult_serieses_items[];
}

export interface SeriesListResult {
  /**
   * Search Series
   */
  serieses: SeriesListResult_serieses;
}

export interface SeriesListResultVariables {
  listType: ListType;
  albumTypes?: AlbumType[] | null;
  take: number;
  skip: number;
}
