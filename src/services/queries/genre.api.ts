// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type GenreResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;

export interface GenreResultQuery { genre: { id: string; name: string } }

export const GenreResultDocument = gql`
  query GenreResult($id: ID!) {
  	genre(id: $id) {
  		id
  		name
  	}
  }
`;
export type GenreResultQueryResult = useQuery.Result<
	GenreResultQuery,
	GenreResultQueryVariables
>;
