/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FolderType } from "./graphql-types";

// ====================================================
// GraphQL query operation: FolderResult
// ====================================================

export interface FolderResult_folder_genres {
  id: string;
  name: string;
}

export interface FolderResult_folder_children {
  id: string;
  title: string | null;
  folderType: FolderType;
}

export interface FolderResult_folder_tracks_album {
  id: string;
}

export interface FolderResult_folder_tracks_artist {
  id: string;
}

export interface FolderResult_folder_tracks_series {
  id: string;
}

export interface FolderResult_folder_tracks_tag {
  mediaDuration: number | null;
  title: string | null;
  artist: string | null;
  genres: string[] | null;
  album: string | null;
  disc: number | null;
  trackNr: number | null;
}

export interface FolderResult_folder_tracks {
  id: string;
  name: string;
  album: FolderResult_folder_tracks_album | null;
  artist: FolderResult_folder_tracks_artist | null;
  series: FolderResult_folder_tracks_series | null;
  tag: FolderResult_folder_tracks_tag | null;
}

export interface FolderResult_folder {
  id: string;
  title: string | null;
  childrenCount: number;
  tracksCount: number;
  folderType: FolderType;
  artist: string | null;
  genres: FolderResult_folder_genres[];
  children: FolderResult_folder_children[];
  tracks: FolderResult_folder_tracks[] | null;
}

export interface FolderResult {
  /**
   * Get a Folder by Id
   */
  folder: FolderResult_folder;
}

export interface FolderResultVariables {
  id: string;
}
