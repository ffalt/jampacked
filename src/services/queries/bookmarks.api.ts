// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type BookmarkResultQueryVariables = Types.Exact<{
  take: Types.Scalars['Int']['input'];
  skip: Types.Scalars['Int']['input'];
  ids?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  trackIDs?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  episodeIDs?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  userIDs?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
}>;


export type BookmarkResultQuery = { bookmarks: { total: number, skip?: number | null, take?: number | null, items: Array<{ id: string, comment?: string | null, track?: { id: string, name: string, album?: { id: string, name: string } | null, artist?: { id: string, name: string } | null, series?: { id: string, name: string } | null, genres: Array<{ id: string, name: string }>, tag?: { mediaDuration?: number | null, title?: string | null, disc?: number | null, trackNr?: number | null } | null } | null, episode?: { id: string, name: string, podcast: { id: string }, tag?: { mediaDuration?: number | null, title?: string | null, artist?: string | null, genres?: Array<string> | null, album?: string | null, disc?: number | null, trackNr?: number | null } | null } | null }> } };


export const BookmarkResultDocument = gql`
    query BookmarkResult($take: Int!, $skip: Int!, $ids: [ID!], $trackIDs: [ID!], $episodeIDs: [ID!], $userIDs: [ID!]) {
  bookmarks(
    page: {take: $take, skip: $skip}
    filter: {ids: $ids, trackIDs: $trackIDs, episodeIDs: $episodeIDs, userIDs: $userIDs}
  ) {
    total
    skip
    take
    items {
      id
      comment
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
export type BookmarkResultQueryResult = Apollo.QueryResult<BookmarkResultQuery, BookmarkResultQueryVariables>;