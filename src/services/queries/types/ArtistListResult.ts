/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListType, AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: ArtistListResult
// ====================================================

export interface ArtistListResult_artists_items {
  id: string;
  name: string;
  albumsCount: number;
}

export interface ArtistListResult_artists {
  total: number;
  skip: number | null;
  take: number | null;
  items: ArtistListResult_artists_items[];
}

export interface ArtistListResult {
  /**
   * Search Artists
   */
  artists: ArtistListResult_artists;
}

export interface ArtistListResultVariables {
  listType?: ListType | null;
  seed?: string | null;
  albumTypes?: AlbumType[] | null;
  genreIDs?: string[] | null;
  take: number;
  skip: number;
}
