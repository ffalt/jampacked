// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type AlbumResultQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type AlbumResultQuery = { album: { id: string, name: string, albumType: Types.AlbumType, tracksCount: number, artist: { id: string, name: string }, genres: Array<{ id: string, name: string }>, tracks: Array<{ id: string, name: string, album?: { id: string, name: string } | null, artist?: { id: string, name: string } | null, series?: { id: string, name: string } | null, genres: Array<{ id: string, name: string }>, tag?: { mediaDuration?: number | null, title?: string | null, disc?: number | null, trackNr?: number | null } | null }> } };


export const AlbumResultDocument = gql`
    query AlbumResult($id: ID!) {
  album(id: $id) {
    id
    name
    albumType
    artist {
      id
      name
    }
    tracksCount
    genres {
      id
      name
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
export type AlbumResultQueryResult = Apollo.QueryResult<AlbumResultQuery, AlbumResultQueryVariables>;