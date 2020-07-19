/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchTracksResult
// ====================================================

export interface SearchTracksResult_tracks_items_tag {
  artist: string | null;
}

export interface SearchTracksResult_tracks_items {
  id: string;
  name: string;
  tag: SearchTracksResult_tracks_items_tag | null;
}

export interface SearchTracksResult_tracks {
  total: number;
  skip: number | null;
  items: SearchTracksResult_tracks_items[];
}

export interface SearchTracksResult {
  tracks: SearchTracksResult_tracks;
}

export interface SearchTracksResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
