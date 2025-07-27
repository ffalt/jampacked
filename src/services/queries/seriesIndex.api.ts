// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SeriesIndexResultQueryVariables = Types.Exact<{
	[key: string]: never;
}>;

export interface SeriesIndexResultQuery {
	seriesIndex: {
		groups: Array<{
			name: string;
			items: Array<{ id: string; name: string; albumsCount: number }>;
		}>;
	};
}

export const SeriesIndexResultDocument = gql`
  query SeriesIndexResult {
  	seriesIndex {
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
export type SeriesIndexResultQueryResult = Apollo.QueryResult<
	SeriesIndexResultQuery,
	SeriesIndexResultQueryVariables
>;
