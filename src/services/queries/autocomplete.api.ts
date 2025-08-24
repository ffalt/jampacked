// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type AutocompleteResultQueryVariables = Types.Exact<{
	query: Types.Scalars['String']['input'];
}>;

export interface AutocompleteResultQuery {
	albums: { total: number; items: Array<{ id: string; name: string }> };
	artists: { total: number; items: Array<{ id: string; name: string }> };
	serieses: { total: number; items: Array<{ id: string; name: string }> };
	podcasts: { total: number; items: Array<{ id: string; name: string }> };
	episodes: { total: number; items: Array<{ id: string; name: string }> };
	folders: { total: number; items: Array<{ id: string; name: string }> };
	playlists: { total: number; items: Array<{ id: string; name: string }> };
	tracks: { total: number; items: Array<{ id: string; name: string }> };
}

export const AutocompleteResultDocument = gql`
  query AutocompleteResult($query: String!) {
  	albums(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  	artists(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  	serieses(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  	podcasts(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  	episodes(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  	folders(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  	playlists(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  	tracks(page: { take: 5 }, filter: { query: $query }) {
  		total
  		items {
  			id
  			name
  		}
  	}
  }
`;
export type AutocompleteResultQueryResult = useQuery.Result<
	AutocompleteResultQuery,
	AutocompleteResultQueryVariables
>;
