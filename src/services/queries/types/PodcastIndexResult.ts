/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PodcastIndexResult
// ====================================================

export interface PodcastIndexResult_podcasts_items {
  id: string;
  name: string;
  episodesCount: number;
}

export interface PodcastIndexResult_podcasts {
  items: PodcastIndexResult_podcasts_items[];
}

export interface PodcastIndexResult {
  /**
   * Search Podcasts
   */
  podcasts: PodcastIndexResult_podcasts;
}
