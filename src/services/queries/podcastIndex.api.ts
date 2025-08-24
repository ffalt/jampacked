// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type PodcastIndexResultQueryVariables = Types.Exact<{
	[key: string]: never;
}>;

export interface PodcastIndexResultQuery {
	podcasts: {
		items: Array<{ id: string; name: string; episodesCount: number }>;
	};
}

export const PodcastIndexResultDocument = gql`
  query PodcastIndexResult {
  	podcasts {
  		items {
  			id
  			name
  			episodesCount
  		}
  	}
  }
`;
export type PodcastIndexResultQueryResult = useQuery.Result<
	PodcastIndexResultQuery,
	PodcastIndexResultQueryVariables
>;
