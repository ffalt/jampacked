// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UserResultQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserResultQuery = { currentUser: { stats: { bookmark: number, playlist: number, favorite: { album: number, artist: number, folder: number, series: number, track: number, albumTypes: { album: number, artistCompilation: number, audiobook: number, compilation: number, series: number, single: number, soundtrack: number, ep: number, live: number, bootleg: number, unknown: number }, artistTypes: { album: number } }, played: { album: number, artist: number, folder: number, series: number, track: number, albumTypes: { album: number, artistCompilation: number, audiobook: number, compilation: number, series: number, single: number, soundtrack: number, ep: number, live: number, bootleg: number, unknown: number }, artistTypes: { album: number } } } } };


export const UserResultDocument = gql`
    query UserResult {
  currentUser {
    stats {
      bookmark
      playlist
      favorite {
        album
        albumTypes {
          album
          artistCompilation
          audiobook
          compilation
          series
          single
          soundtrack
          ep
          live
          bootleg
          unknown
        }
        artist
        artistTypes {
          album
        }
        folder
        series
        track
      }
      played {
        album
        albumTypes {
          album
          artistCompilation
          audiobook
          compilation
          series
          single
          soundtrack
          ep
          live
          bootleg
          unknown
        }
        artist
        artistTypes {
          album
        }
        folder
        series
        track
      }
    }
  }
}
    `;
export type UserResultQueryResult = Apollo.QueryResult<UserResultQuery, UserResultQueryVariables>;
