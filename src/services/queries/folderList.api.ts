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
export type AlbumType =
	| 'album' |
	'audiobook' |
	'bootleg' |
	'compilation' |
	'ep' |
	'live' |
	'series' |
	'single' |
	'soundtrack' |
	'unknown';

export type FolderType =
	'album' | 'artist' | 'collection' | 'extras' | 'multialbum' | 'unknown';

/** Type of List Request */
export type ListType =
	'avghighest' | 'faved' | 'frequent' | 'highest' | 'random' | 'recent';

export type FolderListResultQueryVariables = Exact<{
	listType?: Types.ListType | null | undefined;
	seed?: string | null | undefined;
	albumTypes?: Array<Types.AlbumType> | Types.AlbumType | null | undefined;
	genreIDs?: Array<string | number> | string | number | null | undefined;
	take: number;
	skip: number;
}>;

export interface FolderListResultQuery {
	folders: {
		total: number;
		skip: number | null;
		take: number | null;
		items: Array<{
			id: string;
			name: string;
			folderType: Types.FolderType;
			tracksCount: number;
			childrenCount: number;
		}>;
	};
}

export const FolderListResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'FolderListResult' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'listType' }
					},
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'ListType' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'seed' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
				},
				{
					kind: 'VariableDefinition',
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'albumTypes' }
					},
					type: {
						kind: 'ListType',
						type: {
							kind: 'NonNullType',
							type: {
								kind: 'NamedType',
								name: { kind: 'Name', value: 'AlbumType' }
							}
						}
					}
				},
				{
					kind: 'VariableDefinition',
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'genreIDs' }
					},
					type: {
						kind: 'ListType',
						type: {
							kind: 'NonNullType',
							type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
						}
					}
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
					}
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
					}
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'folders' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'list' },
								value: {
									kind: 'Variable',
									name: { kind: 'Name', value: 'listType' }
								}
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'seed' },
								value: {
									kind: 'Variable',
									name: { kind: 'Name', value: 'seed' }
								}
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filter' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'albumTypes' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'albumTypes' }
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'genreIDs' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'genreIDs' }
											}
										}
									]
								}
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'take' }
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'skip' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'skip' }
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'total' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'take' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'folderType' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'tracksCount' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'childrenCount' }
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
} as unknown as DocumentNode<
	FolderListResultQuery,
	FolderListResultQueryVariables
>;
