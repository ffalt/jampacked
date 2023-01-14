// @generated
// This file was automatically generated and should not be edited.

import * as Types from './_types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type HomeResultQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HomeResultQuery = { artistsRecent: { items: Array<{ id: string, name: string }> }, artistsFaved: { items: Array<{ id: string, name: string }> }, albumsRecent: { items: Array<{ id: string, name: string }> }, albumsFaved: { items: Array<{ id: string, name: string }> }, podcasts: { total: number }, genres: { total: number }, stats: { track: number, folder: number, series: number, artist: number, album: number, artistTypes: { album: number, compilation: number, artistCompilation: number, unknown: number, live: number, audiobook: number, soundtrack: number, bootleg: number, ep: number, single: number }, albumTypes: { album: number, compilation: number, artistCompilation: number, unknown: number, live: number, audiobook: number, soundtrack: number, bootleg: number, ep: number, single: number } }, currentUser: { stats: { bookmark: number, playlist: number, favorite: { album: number, artist: number, folder: number, series: number, track: number, albumTypes: { album: number, artistCompilation: number, audiobook: number, compilation: number, series: number, single: number, soundtrack: number, ep: number, live: number, bootleg: number, unknown: number }, artistTypes: { album: number } }, played: { album: number, artist: number, folder: number, series: number, track: number, albumTypes: { album: number, artistCompilation: number, audiobook: number, compilation: number, series: number, single: number, soundtrack: number, ep: number, live: number, bootleg: number, unknown: number }, artistTypes: { album: number } } } } };


export const HomeResultDocument = gql`
    query HomeResult {
  artistsRecent: artists(
    list: recent
    filter: {albumTypes: [album]}
    page: {take: 5}
  ) {
    items {
      id
      name
    }
  }
  artistsFaved: artists(
    list: faved
    filter: {albumTypes: [album]}
    page: {take: 5}
  ) {
    items {
      id
      name
    }
  }
  albumsRecent: albums(
    list: recent
    filter: {albumTypes: [album]}
    page: {take: 5}
  ) {
    items {
      id
      name
    }
  }
  albumsFaved: albums(list: faved, filter: {albumTypes: [album]}, page: {take: 5}) {
    items {
      id
      name
    }
  }
  podcasts(page: {take: 0}) {
    total
  }
  genres {
    total
  }
  stats {
    track
    folder
    series
    artist
    artistTypes {
      album
      compilation
      artistCompilation
      unknown
      live
      audiobook
      soundtrack
      bootleg
      ep
      single
    }
    album
    albumTypes {
      album
      compilation
      artistCompilation
      unknown
      live
      audiobook
      soundtrack
      bootleg
      ep
      single
    }
  }
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
export type HomeResultQueryResult = Apollo.QueryResult<HomeResultQuery, HomeResultQueryVariables>;