// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GenreResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID'];
}>;


export type GenreResultQuery = { genre: { id: string, name: string } };


export const GenreResultDocument = gql`
    query GenreResult($id: ID!) {
  genre(id: $id) {
    id
    name
  }
}
    `;
export type GenreResultQueryResult = Apollo.QueryResult<GenreResultQuery, GenreResultQueryVariables>;
