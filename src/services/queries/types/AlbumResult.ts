/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: AlbumResult
// ====================================================

export interface AlbumResult_album_artist {
  id: string;
  name: string;
}

export interface AlbumResult_album_genres {
  id: string;
  name: string;
}

export interface AlbumResult_album_tracks_album {
  id: string;
  name: string;
}

export interface AlbumResult_album_tracks_artist {
  id: string;
  name: string;
}

export interface AlbumResult_album_tracks_series {
  id: string;
  name: string;
}

export interface AlbumResult_album_tracks_genres {
  id: string;
  name: string;
}

export interface AlbumResult_album_tracks_tag {
  mediaDuration: number | null;
  title: string | null;
  disc: number | null;
  trackNr: number | null;
}

export interface AlbumResult_album_tracks {
  id: string;
  name: string;
  album: AlbumResult_album_tracks_album | null;
  artist: AlbumResult_album_tracks_artist | null;
  series: AlbumResult_album_tracks_series | null;
  genres: AlbumResult_album_tracks_genres[];
  tag: AlbumResult_album_tracks_tag | null;
}

export interface AlbumResult_album {
  id: string;
  name: string;
  albumType: AlbumType;
  artist: AlbumResult_album_artist;
  tracksCount: number;
  genres: AlbumResult_album_genres[];
  tracks: AlbumResult_album_tracks[];
}

export interface AlbumResult {
  /**
   * Get an Album by Id
   */
  album: AlbumResult_album;
}

export interface AlbumResultVariables {
  id: string;
}
