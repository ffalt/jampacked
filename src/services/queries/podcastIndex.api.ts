// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
export type PodcastIndexResultQueryResult = Apollo.QueryResult<
	PodcastIndexResultQuery,
	PodcastIndexResultQueryVariables
>;
