/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserResult
// ====================================================

export interface UserResult_currentUser_stats_favorite_albumTypes {
  album: number;
  artistCompilation: number;
  audiobook: number;
  compilation: number;
  series: number;
  single: number;
  soundtrack: number;
  ep: number;
  live: number;
  bootleg: number;
  unknown: number;
}

export interface UserResult_currentUser_stats_favorite_artistTypes {
  album: number;
}

export interface UserResult_currentUser_stats_favorite {
  album: number;
  albumTypes: UserResult_currentUser_stats_favorite_albumTypes;
  artist: number;
  artistTypes: UserResult_currentUser_stats_favorite_artistTypes;
  folder: number;
  series: number;
  track: number;
}

export interface UserResult_currentUser_stats_played_albumTypes {
  album: number;
  artistCompilation: number;
  audiobook: number;
  compilation: number;
  series: number;
  single: number;
  soundtrack: number;
  ep: number;
  live: number;
  bootleg: number;
  unknown: number;
}

export interface UserResult_currentUser_stats_played_artistTypes {
  album: number;
}

export interface UserResult_currentUser_stats_played {
  album: number;
  albumTypes: UserResult_currentUser_stats_played_albumTypes;
  artist: number;
  artistTypes: UserResult_currentUser_stats_played_artistTypes;
  folder: number;
  series: number;
  track: number;
}

export interface UserResult_currentUser_stats {
  bookmark: number;
  playlist: number;
  favorite: UserResult_currentUser_stats_favorite;
  played: UserResult_currentUser_stats_played;
}

export interface UserResult_currentUser {
  stats: UserResult_currentUser_stats;
}

export interface UserResult {
  currentUser: UserResult_currentUser;
}
