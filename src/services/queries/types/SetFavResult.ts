/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetFavResult
// ====================================================

export interface SetFavResult_fav {
  id: string;
  faved: any | null;
}

export interface SetFavResult {
  fav: SetFavResult_fav;
}

export interface SetFavResultVariables {
  id: string;
  remove?: boolean | null;
}
