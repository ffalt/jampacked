/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListType, AlbumType, FolderType } from "./graphql-types";

// ====================================================
// GraphQL query operation: FolderListResult
// ====================================================

export interface FolderListResult_folders_items {
  id: string;
  name: string;
  folderType: FolderType;
  tracksCount: number;
  childrenCount: number;
}

export interface FolderListResult_folders {
  total: number;
  skip: number | null;
  take: number | null;
  items: FolderListResult_folders_items[];
}

export interface FolderListResult {
  /**
   * Search Folders
   */
  folders: FolderListResult_folders;
}

export interface FolderListResultVariables {
  listType: ListType;
  seed?: string | null;
  albumTypes?: AlbumType[] | null;
  take: number;
  skip: number;
}
