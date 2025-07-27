// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type PlaylistIndexResultQueryVariables = Types.Exact<{
	[key: string]: never;
}>;

export interface PlaylistIndexResultQuery {
	playlists: {
		items: Array<{ id: string; name: string; entriesCount: number }>;
	};
}

export const PlaylistIndexResultDocument = gql`
  query PlaylistIndexResult {
  	playlists {
  		items {
  			id
  			name
  			entriesCount
  		}
  	}
  }
`;
export type PlaylistIndexResultQueryResult = Apollo.QueryResult<
	PlaylistIndexResultQuery,
	PlaylistIndexResultQueryVariables
>;
