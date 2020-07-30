/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FavResult
// ====================================================

export interface FavResult_state {
  id: string;
  faved: any | null;
}

export interface FavResult {
  /**
   * Get User State (fav/rate/etc) for Base Objects
   */
  state: FavResult_state;
}

export interface FavResultVariables {
  id: string;
}
