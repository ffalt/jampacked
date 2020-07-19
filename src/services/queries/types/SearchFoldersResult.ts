/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FolderType } from "./graphql-types";

// ====================================================
// GraphQL query operation: SearchFoldersResult
// ====================================================

export interface SearchFoldersResult_folders_items {
  id: string;
  name: string;
  folderType: FolderType;
  childrenCount: number;
  tracksCount: number;
}

export interface SearchFoldersResult_folders {
  total: number;
  skip: number | null;
  items: SearchFoldersResult_folders_items[];
}

export interface SearchFoldersResult {
  /**
   * Search Folders
   */
  folders: SearchFoldersResult_folders;
}

export interface SearchFoldersResultVariables {
  query: string;
  take?: number | null;
  skip?: number | null;
}
