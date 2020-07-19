/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: ArtistResult
// ====================================================

export interface ArtistResult_artist_albums {
  id: string;
  name: string;
  albumType: AlbumType;
  seriesNr: string | null;
  year: number | null;
}

export interface ArtistResult_artist {
  id: string;
  name: string;
  albumsCount: number;
  tracksCount: number;
  genres: string[];
  albums: ArtistResult_artist_albums[];
}

export interface ArtistResult {
  /**
   * Get an Artist by Id
   */
  artist: ArtistResult_artist;
}

export interface ArtistResultVariables {
  id: string;
}
