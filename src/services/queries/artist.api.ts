// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type ArtistResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;

export interface ArtistResultQuery {
	artist: {
		id: string;
		name: string;
		albumsCount: number;
		tracksCount: number;
		genres: Array<{ id: string; name: string }>;
		albums: Array<{
			id: string;
			name: string;
			albumType: Types.AlbumType;
			seriesNr?: string | null;
			year?: number | null;
		}>;
	};
}

export const ArtistResultDocument = gql`
  query ArtistResult($id: ID!) {
  	artist(id: $id) {
  		id
  		name
  		albumsCount
  		tracksCount
  		genres {
  			id
  			name
  		}
  		albums {
  			id
  			name
  			albumType
  			seriesNr
  			year
  		}
  	}
  }
`;
export type ArtistResultQueryResult = useQuery.Result<
	ArtistResultQuery,
	ArtistResultQueryVariables
>;
