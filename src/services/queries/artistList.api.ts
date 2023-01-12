// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ArtistListResultQueryVariables = Types.Exact<{
  listType?: Types.InputMaybe<Types.ListType>;
  seed?: Types.InputMaybe<Types.Scalars['String']>;
  albumTypes?: Types.InputMaybe<Array<Types.AlbumType> | Types.AlbumType>;
  genreIDs?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  take: Types.Scalars['Int'];
  skip: Types.Scalars['Int'];
}>;


export type ArtistListResultQuery = { artists: { total: number, skip?: number | null, take?: number | null, items: Array<{ id: string, name: string, albumsCount: number }> } };


export const ArtistListResultDocument = gql`
    query ArtistListResult($listType: ListType, $seed: String, $albumTypes: [AlbumType!], $genreIDs: [ID!], $take: Int!, $skip: Int!) {
  artists(
    list: $listType
    seed: $seed
    filter: {albumTypes: $albumTypes, genreIDs: $genreIDs}
    page: {take: $take, skip: $skip}
  ) {
    total
    skip
    take
    items {
      id
      name
      albumsCount
    }
  }
}
    `;
export type ArtistListResultQueryResult = Apollo.QueryResult<ArtistListResultQuery, ArtistListResultQueryVariables>;