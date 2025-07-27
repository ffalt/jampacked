// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type PodcastEpisodeResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;

export interface PodcastEpisodeResultQuery {
	episode: {
		id: string;
		name: string;
		date: any;
		duration?: number | null;
		tag?: {
			title?: string | null;
			artist?: string | null;
			genres?: Array<string> | null;
		} | null;
		podcast: { id: string; name: string };
	};
}

export const PodcastEpisodeResultDocument = gql`
  query PodcastEpisodeResult($id: ID!) {
  	episode(id: $id) {
  		id
  		name
  		date
  		duration
  		tag {
  			title
  			artist
  			genres
  		}
  		podcast {
  			id
  			name
  		}
  	}
  }
`;
export type PodcastEpisodeResultQueryResult = Apollo.QueryResult<
	PodcastEpisodeResultQuery,
	PodcastEpisodeResultQueryVariables
>;
