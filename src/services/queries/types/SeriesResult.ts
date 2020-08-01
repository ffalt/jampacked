/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: SeriesResult
// ====================================================

export interface SeriesResult_series_artist {
  id: string;
  name: string;
}

export interface SeriesResult_series_albums {
  id: string;
  name: string;
  albumType: AlbumType;
  seriesNr: string | null;
  year: number | null;
}

export interface SeriesResult_series {
  id: string;
  name: string;
  artist: SeriesResult_series_artist | null;
  tracksCount: number;
  albums: SeriesResult_series_albums[];
}

export interface SeriesResult {
  /**
   * Get a Series by Id
   */
  series: SeriesResult_series;
}

export interface SeriesResultVariables {
  id: string;
}
