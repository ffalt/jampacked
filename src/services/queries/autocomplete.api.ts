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

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AutocompleteResultQueryVariables = Exact<{
	query: string;
}>;

export interface AutocompleteResultQuery {
	albums: { total: number; items: Array<{ id: string; name: string }> };
	artists: { total: number; items: Array<{ id: string; name: string }> };
	serieses: { total: number; items: Array<{ id: string; name: string }> };
	podcasts: { total: number; items: Array<{ id: string; name: string }> };
	episodes: { total: number; items: Array<{ id: string; name: string }> };
	folders: { total: number; items: Array<{ id: string; name: string }> };
	playlists: { total: number; items: Array<{ id: string; name: string }> };
	tracks: { total: number; items: Array<{ id: string; name: string }> };
}

export const AutocompleteResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'AutocompleteResult' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'query' }
					},
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
					}
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'albums' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'artists' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'serieses' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'podcasts' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'episodes' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'folders' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'playlists' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'tracks' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'page' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'take' },
											value: { kind: 'IntValue', value: '5' }
										}
									]
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
											name: { kind: 'Name', value: 'query' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'query' }
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
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
	AutocompleteResultQuery,
	AutocompleteResultQueryVariables
>;
