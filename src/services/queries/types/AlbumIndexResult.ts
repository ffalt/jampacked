/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: AlbumIndexResult
// ====================================================

export interface AlbumIndexResult_albumIndex_groups_items_artist {
  name: string;
}

export interface AlbumIndexResult_albumIndex_groups_items {
  id: string;
  name: string;
  artist: AlbumIndexResult_albumIndex_groups_items_artist;
}

export interface AlbumIndexResult_albumIndex_groups {
  name: string;
  items: AlbumIndexResult_albumIndex_groups_items[];
}

export interface AlbumIndexResult_albumIndex {
  groups: AlbumIndexResult_albumIndex_groups[];
}

export interface AlbumIndexResult {
  /**
   * Get the Navigation Index for Albums
   */
  albumIndex: AlbumIndexResult_albumIndex;
}

export interface AlbumIndexResultVariables {
  albumTypes?: AlbumType[] | null;
}
