// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type PodcastResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID'];
}>;


export type PodcastResultQuery = { podcast: { id: string, name: string, description?: string | null, episodes: Array<{ id: string, name: string, date: any, duration?: number | null, tag?: { title?: string | null, artist?: string | null, genres?: Array<string> | null } | null }> } };


export const PodcastResultDocument = gql`
    query PodcastResult($id: ID!) {
  podcast(id: $id) {
    id
    name
    description
    episodes {
      id
      name
      date
      duration
      tag {
        title
        artist
        genres
      }
    }
  }
}
    `;
export type PodcastResultQueryResult = Apollo.QueryResult<PodcastResultQuery, PodcastResultQueryVariables>;
