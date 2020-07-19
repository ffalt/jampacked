/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlaylistResult
// ====================================================

export interface PlaylistResult_playlist_entries_track_album {
  id: string;
}

export interface PlaylistResult_playlist_entries_track_artist {
  id: string;
}

export interface PlaylistResult_playlist_entries_track_series {
  id: string;
}

export interface PlaylistResult_playlist_entries_track_tag {
  mediaDuration: number | null;
  title: string | null;
  artist: string | null;
  genres: string[] | null;
  album: string | null;
  disc: number | null;
  trackNr: number | null;
}

export interface PlaylistResult_playlist_entries_track {
  id: string;
  name: string;
  album: PlaylistResult_playlist_entries_track_album | null;
  artist: PlaylistResult_playlist_entries_track_artist | null;
  series: PlaylistResult_playlist_entries_track_series | null;
  tag: PlaylistResult_playlist_entries_track_tag | null;
}

export interface PlaylistResult_playlist_entries_episode_podcast {
  id: string;
}

export interface PlaylistResult_playlist_entries_episode_tag {
  mediaDuration: number | null;
  title: string | null;
  artist: string | null;
  genres: string[] | null;
  album: string | null;
  disc: number | null;
  trackNr: number | null;
}

export interface PlaylistResult_playlist_entries_episode {
  id: string;
  name: string;
  podcast: PlaylistResult_playlist_entries_episode_podcast;
  tag: PlaylistResult_playlist_entries_episode_tag | null;
}

export interface PlaylistResult_playlist_entries {
  track: PlaylistResult_playlist_entries_track;
  episode: PlaylistResult_playlist_entries_episode;
}

export interface PlaylistResult_playlist {
  id: string;
  name: string;
  comment: string | null;
  entries: PlaylistResult_playlist_entries[];
}

export interface PlaylistResult {
  /**
   * Get a Playlist by Id
   */
  playlist: PlaylistResult_playlist;
}

export interface PlaylistResultVariables {
  id: string;
}
