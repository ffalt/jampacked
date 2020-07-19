/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FolderType } from "./graphql-types";

// ====================================================
// GraphQL query operation: FolderIndexResult
// ====================================================

export interface FolderIndexResult_folderIndex_groups_items {
  id: string;
  name: string;
  tracksCount: number;
  folderType: FolderType;
  childrenCount: number;
}

export interface FolderIndexResult_folderIndex_groups {
  name: string;
  items: FolderIndexResult_folderIndex_groups_items[];
}

export interface FolderIndexResult_folderIndex {
  groups: FolderIndexResult_folderIndex_groups[];
}

export interface FolderIndexResult {
  /**
   * Get the Navigation Index for Folders
   */
  folderIndex: FolderIndexResult_folderIndex;
}

export interface FolderIndexResultVariables {
  level?: number | null;
}
