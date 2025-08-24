// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
export type FavResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;

export interface FavResultQuery { state: { id: string; faved?: any | null } }

export type SetFavResultMutationVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
	remove?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;

export interface SetFavResultMutation { fav: { id: string; faved?: any | null } }

export const FavResultDocument = gql`
  query FavResult($id: ID!) {
  	state(id: $id) {
  		id
  		faved
  	}
  }
`;
export type FavResultQueryResult = useQuery.Result<
	FavResultQuery,
	FavResultQueryVariables
>;
export const SetFavResultDocument = gql`
  mutation SetFavResult($id: ID!, $remove: Boolean) {
  	fav(id: $id, remove: $remove) {
  		id
  		faved
  	}
  }
`;
export type SetFavResultMutationFn = useMutation.MutationFunction<
	SetFavResultMutation,
	SetFavResultMutationVariables
>;
export type SetFavResultMutationResult =
	useMutation.Result<SetFavResultMutation>;
export type SetFavResultMutationOptions = useMutation.MutationFunctionOptions<
	SetFavResultMutation,
	SetFavResultMutationVariables
>;
