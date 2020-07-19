/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PodcastResult
// ====================================================

export interface PodcastResult_podcast_episodes_tag {
  title: string | null;
  artist: string | null;
}

export interface PodcastResult_podcast_episodes {
  id: string;
  name: string;
  date: number;
  duration: number | null;
  tag: PodcastResult_podcast_episodes_tag | null;
}

export interface PodcastResult_podcast {
  id: string;
  name: string;
  description: string | null;
  episodes: PodcastResult_podcast_episodes[];
}

export interface PodcastResult {
  /**
   * Get a Podcast by Id
   */
  podcast: PodcastResult_podcast;
}

export interface PodcastResultVariables {
  id: string;
}
