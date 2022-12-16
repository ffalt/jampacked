// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SeriesResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID'];
}>;


export type SeriesResultQuery = { series: { id: string, name: string, tracksCount: number, artist?: { id: string, name: string } | null, albums: Array<{ id: string, name: string, albumType: Types.AlbumType, seriesNr?: string | null, year?: number | null }> } };


export const SeriesResultDocument = gql`
    query SeriesResult($id: ID!) {
  series(id: $id) {
    id
    name
    artist {
      id
      name
    }
    tracksCount
    albums {
      id
      name
      albumType
      seriesNr
      year
    }
  }
}
    `;
export type SeriesResultQueryResult = Apollo.QueryResult<SeriesResultQuery, SeriesResultQueryVariables>;
