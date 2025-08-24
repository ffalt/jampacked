// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
export type RateResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;

export interface RateResultQuery { state: { id: string; rated?: number | null } }

export type SetRateResultMutationVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
	rating: Types.Scalars['Int']['input'];
}>;

export interface SetRateResultMutation {
	rate: { id: string; rated?: number | null };
}

export const RateResultDocument = gql`
  query RateResult($id: ID!) {
  	state(id: $id) {
  		id
  		rated
  	}
  }
`;
export type RateResultQueryResult = useQuery.Result<
	RateResultQuery,
	RateResultQueryVariables
>;
export const SetRateResultDocument = gql`
  mutation SetRateResult($id: ID!, $rating: Int!) {
  	rate(id: $id, rating: $rating) {
  		id
  		rated
  	}
  }
`;
export type SetRateResultMutationFn = useMutation.MutationFunction<
	SetRateResultMutation,
	SetRateResultMutationVariables
>;
export type SetRateResultMutationResult =
	useMutation.Result<SetRateResultMutation>;
export type SetRateResultMutationOptions = useMutation.MutationFunctionOptions<
	SetRateResultMutation,
	SetRateResultMutationVariables
>;
