// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type AlbumIndexResultQueryVariables = Types.Exact<{
	albumTypes?: Types.InputMaybe<Array<Types.AlbumType> | Types.AlbumType>;
}>;

export interface AlbumIndexResultQuery {
	albumIndex: {
		groups: Array<{
			name: string;
			items: Array<{ id: string; name: string; artist: { name: string } }>;
		}>;
	};
}

export const AlbumIndexResultDocument = gql`
  query AlbumIndexResult($albumTypes: [AlbumType!]) {
  	albumIndex(filter: { albumTypes: $albumTypes }) {
  		groups {
  			name
  			items {
  				id
  				name
  				artist {
  					name
  				}
  			}
  		}
  	}
  }
`;
export type AlbumIndexResultQueryResult = useQuery.Result<
	AlbumIndexResultQuery,
	AlbumIndexResultQueryVariables
>;
