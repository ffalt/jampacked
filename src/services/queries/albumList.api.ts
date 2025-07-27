// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type AlbumListResultQueryVariables = Types.Exact<{
	listType?: Types.InputMaybe<Types.ListType>;
	seed?: Types.InputMaybe<Types.Scalars['String']['input']>;
	albumTypes?: Types.InputMaybe<Array<Types.AlbumType> | Types.AlbumType>;
	genreIDs?: Types.InputMaybe<
		Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']
	>;
	take: Types.Scalars['Int']['input'];
	skip: Types.Scalars['Int']['input'];
}>;

export interface AlbumListResultQuery {
	albums: {
		total: number;
		skip?: number | null;
		take?: number | null;
		items: Array<{ id: string; name: string; artist: { name: string } }>;
	};
}

export const AlbumListResultDocument = gql`
  query AlbumListResult(
  	$listType: ListType
  	$seed: String
  	$albumTypes: [AlbumType!]
  	$genreIDs: [ID!]
  	$take: Int!
  	$skip: Int!
  ) {
  	albums(
  		list: $listType
  		seed: $seed
  		filter: { albumTypes: $albumTypes, genreIDs: $genreIDs }
  		page: { take: $take, skip: $skip }
  	) {
  		total
  		skip
  		take
  		items {
  			id
  			name
  			artist {
  				name
  			}
  		}
  	}
  }
`;
export type AlbumListResultQueryResult = Apollo.QueryResult<
	AlbumListResultQuery,
	AlbumListResultQueryVariables
>;
