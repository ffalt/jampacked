// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type FolderResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID'];
}>;


export type FolderResultQuery = { folder: { id: string, title: string, childrenCount: number, tracksCount: number, folderType: Types.FolderType, artist?: string | null, genres: Array<{ id: string, name: string }>, children: Array<{ id: string, title: string, folderType: Types.FolderType }>, tracks?: Array<{ id: string, name: string, album?: { id: string, name: string } | null, artist?: { id: string, name: string } | null, series?: { id: string, name: string } | null, genres: Array<{ id: string, name: string }>, tag?: { mediaDuration?: number | null, title?: string | null, disc?: number | null, trackNr?: number | null } | null }> | null } };


export const FolderResultDocument = gql`
    query FolderResult($id: ID!) {
  folder(id: $id) {
    id
    title
    childrenCount
    tracksCount
    folderType
    artist
    genres {
      id
      name
    }
    children {
      id
      title
      folderType
    }
    tracks {
      id
      name
      album {
        id
        name
      }
      artist {
        id
        name
      }
      series {
        id
        name
      }
      genres {
        id
        name
      }
      tag {
        mediaDuration
        title
        disc
        trackNr
      }
    }
  }
}
    `;
export type FolderResultQueryResult = Apollo.QueryResult<FolderResultQuery, FolderResultQueryVariables>;
