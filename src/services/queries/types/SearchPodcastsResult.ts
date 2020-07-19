/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchPodcastsResult
// ====================================================

export interface SearchPodcastsResult_podcasts_items {
  id: string;
  name: string;
  episodesCount: number;
}

export interface SearchPodcastsResult_podcasts {
  total: number;
  skip: number | null;
  items: SearchPodcastsResult_podcasts_items[];
}

export interface SearchPodcastsResult {
  /**
   * Search Podcasts
   */
  podcasts: SearchPodcastsResult_podcasts;
}

export interface SearchPodcastsResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
