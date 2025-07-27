// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type FolderListResultQueryVariables = Types.Exact<{
	listType?: Types.InputMaybe<Types.ListType>;
	seed?: Types.InputMaybe<Types.Scalars['String']['input']>;
	albumTypes?: Types.InputMaybe<Array<Types.AlbumType> | Types.AlbumType>;
	genreIDs?: Types.InputMaybe<
		Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']
	>;
	take: Types.Scalars['Int']['input'];
	skip: Types.Scalars['Int']['input'];
}>;

export interface FolderListResultQuery {
	folders: {
		total: number;
		skip?: number | null;
		take?: number | null;
		items: Array<{
			id: string;
			name: string;
			folderType: Types.FolderType;
			tracksCount: number;
			childrenCount: number;
		}>;
	};
}

export const FolderListResultDocument = gql`
  query FolderListResult(
  	$listType: ListType
  	$seed: String
  	$albumTypes: [AlbumType!]
  	$genreIDs: [ID!]
  	$take: Int!
  	$skip: Int!
  ) {
  	folders(
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
  			folderType
  			tracksCount
  			childrenCount
  		}
  	}
  }
`;
export type FolderListResultQueryResult = Apollo.QueryResult<
	FolderListResultQuery,
	FolderListResultQueryVariables
>;
