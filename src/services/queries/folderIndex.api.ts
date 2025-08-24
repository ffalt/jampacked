// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
export type FolderIndexResultQueryVariables = Types.Exact<{
	level?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export interface FolderIndexResultQuery {
	folderIndex: {
		groups: Array<{
			name: string;
			items: Array<{
				id: string;
				name: string;
				tracksCount: number;
				folderType: Types.FolderType;
				childrenCount: number;
			}>;
		}>;
	};
}

export const FolderIndexResultDocument = gql`
  query FolderIndexResult($level: Int) {
  	folderIndex(filter: { level: $level }) {
  		groups {
  			name
  			items {
  				id
  				name
  				tracksCount
  				folderType
  				childrenCount
  			}
  		}
  	}
  }
`;
export type FolderIndexResultQueryResult = useQuery.Result<
	FolderIndexResultQuery,
	FolderIndexResultQueryVariables
>;
