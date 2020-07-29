/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchEpisodesResult
// ====================================================

export interface SearchEpisodesResult_episodes_items {
  id: string;
  name: string;
  date: any;
}

export interface SearchEpisodesResult_episodes {
  total: number;
  skip: number | null;
  items: SearchEpisodesResult_episodes_items[];
}

export interface SearchEpisodesResult {
  /**
   * Search Episodes
   */
  episodes: SearchEpisodesResult_episodes;
}

export interface SearchEpisodesResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
