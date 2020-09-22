/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TrackResult
// ====================================================

export interface TrackResult_track_album {
  id: string;
}

export interface TrackResult_track_artist {
  id: string;
}

export interface TrackResult_track_series {
  id: string;
}

export interface TrackResult_track_genres {
  id: string;
  name: string;
}

export interface TrackResult_track_tag {
  mediaDuration: number | null;
  title: string | null;
  artist: string | null;
  album: string | null;
  disc: number | null;
  trackNr: number | null;
}

export interface TrackResult_track {
  id: string;
  name: string;
  album: TrackResult_track_album | null;
  artist: TrackResult_track_artist | null;
  series: TrackResult_track_series | null;
  genres: TrackResult_track_genres[];
  tag: TrackResult_track_tag | null;
}

export interface TrackResult {
  track: TrackResult_track;
}

export interface TrackResultVariables {
  id: string;
}
