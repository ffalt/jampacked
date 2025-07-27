// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GenreIndexResultQueryVariables = Types.Exact<{
	[key: string]: never;
}>;

export interface GenreIndexResultQuery {
	genreIndex: {
		groups: Array<{
			name: string;
			items: Array<{
				id: string;
				name: string;
				albumCount: number;
				artistCount: number;
				trackCount: number;
			}>;
		}>;
	};
}

export const GenreIndexResultDocument = gql`
  query GenreIndexResult {
  	genreIndex {
  		groups {
  			name
  			items {
  				id
  				name
  				albumCount
  				artistCount
  				trackCount
  			}
  		}
  	}
  }
`;
export type GenreIndexResultQueryResult = Apollo.QueryResult<
	GenreIndexResultQuery,
	GenreIndexResultQueryVariables
>;
