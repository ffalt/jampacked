// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type WaveformResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;

export interface WaveformResultQuery { waveform: { json?: string | null } }

export const WaveformResultDocument = gql`
  query WaveformResult($id: ID!) {
  	waveform(id: $id) {
  		json
  	}
  }
`;
export type WaveformResultQueryResult = useQuery.Result<
	WaveformResultQuery,
	WaveformResultQueryVariables
>;
