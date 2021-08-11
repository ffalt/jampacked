/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListType } from "./graphql-types";

// ====================================================
// GraphQL query operation: TrackListResult
// ====================================================

export interface TrackListResult_tracks_items_album {
  id: string;
  name: string;
}

export interface TrackListResult_tracks_items_artist {
  id: string;
  name: string;
}

export interface TrackListResult_tracks_items_series {
  id: string;
  name: string;
}

export interface TrackListResult_tracks_items_genres {
  id: string;
  name: string;
}

export interface TrackListResult_tracks_items_tag {
  mediaDuration: number | null;
  title: string | null;
  disc: number | null;
  trackNr: number | null;
}

export interface TrackListResult_tracks_items {
  id: string;
  name: string;
  album: TrackListResult_tracks_items_album | null;
  artist: TrackListResult_tracks_items_artist | null;
  series: TrackListResult_tracks_items_series | null;
  genres: TrackListResult_tracks_items_genres[];
  tag: TrackListResult_tracks_items_tag | null;
}

export interface TrackListResult_tracks {
  total: number;
  skip: number | null;
  take: number | null;
  items: TrackListResult_tracks_items[];
}

export interface TrackListResult {
  tracks: TrackListResult_tracks;
}

export interface TrackListResultVariables {
  listType?: ListType | null;
  genreIDs?: string[] | null;
  seed?: string | null;
  take: number;
  skip: number;
}
