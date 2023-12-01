// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type FavResultQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type FavResultQuery = { state: { id: string, faved?: any | null } };

export type SetFavResultMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  remove?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type SetFavResultMutation = { fav: { id: string, faved?: any | null } };


export const FavResultDocument = gql`
    query FavResult($id: ID!) {
  state(id: $id) {
    id
    faved
  }
}
    `;
export type FavResultQueryResult = Apollo.QueryResult<FavResultQuery, FavResultQueryVariables>;
export const SetFavResultDocument = gql`
    mutation SetFavResult($id: ID!, $remove: Boolean) {
  fav(id: $id, remove: $remove) {
    id
    faved
  }
}
    `;
export type SetFavResultMutationFn = Apollo.MutationFunction<SetFavResultMutation, SetFavResultMutationVariables>;
export type SetFavResultMutationResult = Apollo.MutationResult<SetFavResultMutation>;
export type SetFavResultMutationOptions = Apollo.BaseMutationOptions<SetFavResultMutation, SetFavResultMutationVariables>;