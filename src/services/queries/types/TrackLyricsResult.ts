/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TrackLyricsResult
// ====================================================

export interface TrackLyricsResult_track_lyrics {
  lyrics: string | null;
  source: string | null;
}

export interface TrackLyricsResult_track {
  id: string;
  lyrics: TrackLyricsResult_track_lyrics;
}

export interface TrackLyricsResult {
  track: TrackLyricsResult_track;
}

export interface TrackLyricsResultVariables {
  id: string;
}
