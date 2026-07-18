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
/** Type of List Request */
export type ListType =
	'avghighest' | 'faved' | 'frequent' | 'highest' | 'random' | 'recent';

export type TrackListResultQueryVariables = Exact<{
	listType?: Types.ListType | null | undefined;
	genreIDs?: Array<string | number> | string | number | null | undefined;
	seed?: string | null | undefined;
	take: number;
	skip: number;
}>;

export interface TrackListResultQuery {
	tracks: {
		total: number;
		skip: number | null;
		take: number | null;
		items: Array<{
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
		}>;
	};
}

export const TrackListResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'TrackListResult' },
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
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'seed' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
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
						name: { kind: 'Name', value: 'tracks' },
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
								name: { kind: 'Name', value: 'filter' },
								value: {
									kind: 'ObjectValue',
									fields: [
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
								name: { kind: 'Name', value: 'seed' },
								value: {
									kind: 'Variable',
									name: { kind: 'Name', value: 'seed' }
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
} as unknown as DocumentNode<
	TrackListResultQuery,
	TrackListResultQueryVariables
>;
