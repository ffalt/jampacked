/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlbumType } from "./graphql-types";

// ====================================================
// GraphQL query operation: ArtistIndexResult
// ====================================================

export interface ArtistIndexResult_artistIndex_groups_items {
  id: string;
  name: string;
  albumsCount: number;
}

export interface ArtistIndexResult_artistIndex_groups {
  name: string;
  items: ArtistIndexResult_artistIndex_groups_items[];
}

export interface ArtistIndexResult_artistIndex {
  groups: ArtistIndexResult_artistIndex_groups[];
}

export interface ArtistIndexResult {
  /**
   * Get the Navigation Index for Albums
   */
  artistIndex: ArtistIndexResult_artistIndex;
}

export interface ArtistIndexResultVariables {
  albumTypes?: AlbumType[] | null;
}
