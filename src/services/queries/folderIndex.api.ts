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

export type FolderIndexResultQueryVariables = Exact<{
	level?: number | null | undefined;
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

export const FolderIndexResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'FolderIndexResult' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'level' }
					},
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'folderIndex' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filter' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'level' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'level' }
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'groups' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'items' },
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
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'tracksCount' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'folderType' }
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
			}
		}
	]
} as unknown as DocumentNode<
	FolderIndexResultQuery,
	FolderIndexResultQueryVariables
>;
