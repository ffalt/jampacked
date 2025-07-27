// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ArtistIndexResultQueryVariables = Types.Exact<{
	albumTypes?: Types.InputMaybe<Array<Types.AlbumType> | Types.AlbumType>;
}>;

export interface ArtistIndexResultQuery {
	artistIndex: {
		groups: Array<{
			name: string;
			items: Array<{ id: string; name: string; albumsCount: number }>;
		}>;
	};
}

export const ArtistIndexResultDocument = gql`
  query ArtistIndexResult($albumTypes: [AlbumType!]) {
  	artistIndex(filter: { albumTypes: $albumTypes }) {
  		groups {
  			name
  			items {
  				id
  				name
  				albumsCount
  			}
  		}
  	}
  }
`;
export type ArtistIndexResultQueryResult = Apollo.QueryResult<
	ArtistIndexResultQuery,
	ArtistIndexResultQueryVariables
>;
