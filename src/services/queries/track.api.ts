// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type TrackResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID'];
}>;


export type TrackResultQuery = { track: { id: string, name: string, album?: { id: string, name: string } | null, artist?: { id: string, name: string } | null, series?: { id: string, name: string } | null, genres: Array<{ id: string, name: string }>, tag?: { mediaDuration?: number | null, title?: string | null, disc?: number | null, trackNr?: number | null } | null } };


export const TrackResultDocument = gql`
    query TrackResult($id: ID!) {
  track(id: $id) {
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
    `;
export type TrackResultQueryResult = Apollo.QueryResult<TrackResultQuery, TrackResultQueryVariables>;
