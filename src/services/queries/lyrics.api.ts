// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type TrackLyricsResultQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type TrackLyricsResultQuery = { track: { id: string, lyrics: { lyrics?: string | null, source?: string | null } } };


export const TrackLyricsResultDocument = gql`
    query TrackLyricsResult($id: ID!) {
  track(id: $id) {
    id
    lyrics {
      lyrics
      source
    }
  }
}
    `;
export type TrackLyricsResultQueryResult = Apollo.QueryResult<TrackLyricsResultQuery, TrackLyricsResultQueryVariables>;