// @generated
// This file was automatically generated and should not be edited.

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
	| T |
	{
		[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
	};
import * as Types from './_types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type FolderType =
	'album' | 'artist' | 'collection' | 'extras' | 'multialbum' | 'unknown';

export type FolderResultQueryVariables = Exact<{
	id: string | number;
}>;

export interface FolderResultQuery {
	folder: {
		id: string;
		title: string;
		childrenCount: number;
		tracksCount: number;
		folderType: Types.FolderType;
		artist: string | null;
		genres: Array<{ id: string; name: string }>;
		children: Array<{
			id: string;
			title: string;
			folderType: Types.FolderType;
		}>;
		tracks: Array<{
			id: string;
			name: string;
			album: { id: string; name: string } | null;
			artist: { id: string; name: string } | null;
			series: { id: string; name: string } | null;
			genres: Array<{ id: string; name: string }>;
			tag: {
				mediaDuration: number | null;
				title: string | null;
				disc: number | null;
				trackNr: number | null;
			} | null;
		}> | null;
	};
}

export const FolderResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'FolderResult' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
					}
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'folder' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'title' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'childrenCount' }
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'tracksCount' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'folderType' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'artist' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'genres' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'children' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'title' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'folderType' }
											}
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'tracks' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'album' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'id' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'name' }
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'artist' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'id' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'name' }
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'series' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'id' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'name' }
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'genres' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'id' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'name' }
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'tag' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'mediaDuration' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'title' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'disc' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'trackNr' }
														}
													]
												}
											}
										]
									}
								}
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<FolderResultQuery, FolderResultQueryVariables>;
