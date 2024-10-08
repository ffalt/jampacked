// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type RateResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;


export type RateResultQuery = { state: { id: string, rated?: number | null } };

export type SetRateResultMutationVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
	rating: Types.Scalars['Int']['input'];
}>;


export type SetRateResultMutation = { rate: { id: string, rated?: number | null } };

export const RateResultDocument = gql`
    query RateResult($id: ID!) {
        state(id: $id) {
            id
            rated
        }
    }
`;
export type RateResultQueryResult = Apollo.QueryResult<RateResultQuery, RateResultQueryVariables>;
export const SetRateResultDocument = gql`
    mutation SetRateResult($id: ID!, $rating: Int!) {
        rate(id: $id, rating: $rating) {
            id
            rated
        }
    }
`;
export type SetRateResultMutationFn = Apollo.MutationFunction<SetRateResultMutation, SetRateResultMutationVariables>;
export type SetRateResultMutationResult = Apollo.MutationResult<SetRateResultMutation>;
export type SetRateResultMutationOptions = Apollo.BaseMutationOptions<SetRateResultMutation, SetRateResultMutationVariables>;
