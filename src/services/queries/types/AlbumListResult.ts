/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListType, AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: AlbumListResult
// ====================================================

export interface AlbumListResult_albums_items_artist {
  name: string;
}

export interface AlbumListResult_albums_items {
  id: string;
  name: string;
  artist: AlbumListResult_albums_items_artist;
}

export interface AlbumListResult_albums {
  total: number;
  skip: number | null;
  take: number | null;
  items: AlbumListResult_albums_items[];
}

export interface AlbumListResult {
  /**
   * Search albums
   */
  albums: AlbumListResult_albums;
}

export interface AlbumListResultVariables {
  listType: ListType;
  albumTypes?: AlbumType[] | null;
  take: number;
  skip: number;
}
