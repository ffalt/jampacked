/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HomeResult
// ====================================================

export interface HomeResult_artistsRecent_items {
  id: string;
  name: string;
}

export interface HomeResult_artistsRecent {
  items: HomeResult_artistsRecent_items[];
}

export interface HomeResult_artistsFaved_items {
  id: string;
  name: string;
}

export interface HomeResult_artistsFaved {
  items: HomeResult_artistsFaved_items[];
}

export interface HomeResult_albumsRecent_items {
  id: string;
  name: string;
}

export interface HomeResult_albumsRecent {
  items: HomeResult_albumsRecent_items[];
}

export interface HomeResult_albumsFaved_items {
  id: string;
  name: string;
}

export interface HomeResult_albumsFaved {
  items: HomeResult_albumsFaved_items[];
}

export interface HomeResult_podcasts {
  total: number;
}

export interface HomeResult_stats_artistTypes {
  album: number;
  compilation: number;
  artistCompilation: number;
  unknown: number;
  live: number;
  audiobook: number;
  soundtrack: number;
  bootleg: number;
  ep: number;
  single: number;
}

export interface HomeResult_stats_albumTypes {
  album: number;
  compilation: number;
  artistCompilation: number;
  unknown: number;
  live: number;
  audiobook: number;
  soundtrack: number;
  bootleg: number;
  ep: number;
  single: number;
}

export interface HomeResult_stats {
  track: number;
  folder: number;
  series: number;
  artist: number;
  artistTypes: HomeResult_stats_artistTypes;
  album: number;
  albumTypes: HomeResult_stats_albumTypes;
}

export interface HomeResult {
  /**
   * Search Artists
   */
  artistsRecent: HomeResult_artistsRecent;
  /**
   * Search Artists
   */
  artistsFaved: HomeResult_artistsFaved;
  /**
   * Search albums
   */
  albumsRecent: HomeResult_albumsRecent;
  /**
   * Search albums
   */
  albumsFaved: HomeResult_albumsFaved;
  /**
   * Search Podcasts
   */
  podcasts: HomeResult_podcasts;
  stats: HomeResult_stats;
}
