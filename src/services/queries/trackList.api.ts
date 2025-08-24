// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type TrackListResultQueryVariables = Types.Exact<{
	listType?: Types.InputMaybe<Types.ListType>;
	genreIDs?: Types.InputMaybe<
		Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']
	>;
	seed?: Types.InputMaybe<Types.Scalars['String']['input']>;
	take: Types.Scalars['Int']['input'];
	skip: Types.Scalars['Int']['input'];
}>;

export interface TrackListResultQuery {
	tracks: {
		total: number;
		skip?: number | null;
		take?: number | null;
		items: Array<{
			id: string;
			name: string;
			album?: { id: string; name: string } | null;
			artist?: { id: string; name: string } | null;
			series?: { id: string; name: string } | null;
			genres: Array<{ id: string; name: string }>;
			tag?: {
				mediaDuration?: number | null;
				title?: string | null;
				disc?: number | null;
				trackNr?: number | null;
			} | null;
		}>;
	};
}

export const TrackListResultDocument = gql`
  query TrackListResult(
  	$listType: ListType
  	$genreIDs: [ID!]
  	$seed: String
  	$take: Int!
  	$skip: Int!
  ) {
  	tracks(
  		list: $listType
  		filter: { genreIDs: $genreIDs }
  		seed: $seed
  		page: { take: $take, skip: $skip }
  	) {
  		total
  		skip
  		take
  		items {
  			id
  			name
  			album {
  				id
  				name
  			}
  			artist {
  				id
  				name
  			}
  			series {
  				id
  				name
  			}
  			genres {
  				id
  				name
  			}
  			tag {
  				mediaDuration
  				title
  				disc
  				trackNr
  			}
  		}
  	}
  }
`;
export type TrackListResultQueryResult = useQuery.Result<
	TrackListResultQuery,
	TrackListResultQueryVariables
>;
