// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type PlaylistResultQueryVariables = Types.Exact<{
	id: Types.Scalars['ID']['input'];
}>;

export interface PlaylistResultQuery {
	playlist: {
		id: string;
		name: string;
		comment?: string | null;
		entries: Array<{
			track?: {
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
			} | null;
			episode?: {
				id: string;
				name: string;
				podcast: { id: string };
				tag?: {
					mediaDuration?: number | null;
					title?: string | null;
					artist?: string | null;
					genres?: Array<string> | null;
					album?: string | null;
					disc?: number | null;
					trackNr?: number | null;
				} | null;
			} | null;
		}>;
	};
}

export const PlaylistResultDocument = gql`
  query PlaylistResult($id: ID!) {
  	playlist(id: $id) {
  		id
  		name
  		comment
  		entries {
  			track {
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
  			episode {
  				id
  				name
  				podcast {
  					id
  				}
  				tag {
  					mediaDuration
  					title
  					artist
  					genres
  					album
  					disc
  					trackNr
  				}
  			}
  		}
  	}
  }
`;
export type PlaylistResultQueryResult = useQuery.Result<
	PlaylistResultQuery,
	PlaylistResultQueryVariables
>;
