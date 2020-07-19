/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SeriesIndexResult
// ====================================================

export interface SeriesIndexResult_seriesIndex_groups_items {
  id: string;
  name: string;
  albumsCount: number;
}

export interface SeriesIndexResult_seriesIndex_groups {
  name: string;
  items: SeriesIndexResult_seriesIndex_groups_items[];
}

export interface SeriesIndexResult_seriesIndex {
  groups: SeriesIndexResult_seriesIndex_groups[];
}

export interface SeriesIndexResult {
  /**
   * Get the Navigation Index for Series
   */
  seriesIndex: SeriesIndexResult_seriesIndex;
}
