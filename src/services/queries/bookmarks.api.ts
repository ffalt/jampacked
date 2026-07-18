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
export type BookmarkResultQueryVariables = Exact<{
	take: number;
	skip: number;
	ids?: Array<string | number> | string | number | null | undefined;
	trackIDs?: Array<string | number> | string | number | null | undefined;
	episodeIDs?: Array<string | number> | string | number | null | undefined;
	userIDs?: Array<string | number> | string | number | null | undefined;
}>;

export interface BookmarkResultQuery {
	bookmarks: {
		total: number;
		skip: number | null;
		take: number | null;
		items: Array<{
			id: string;
			comment: string | null;
			track: {
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
			} | null;
			episode: {
				id: string;
				name: string;
				podcast: { id: string };
				tag: {
					mediaDuration: number | null;
					title: string | null;
					artist: string | null;
					genres: Array<string> | null;
					album: string | null;
					disc: number | null;
					trackNr: number | null;
				} | null;
			} | null;
		}>;
	};
}

export const BookmarkResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'BookmarkResult' },
			variableDefinitions: [
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
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
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'trackIDs' }
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
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'episodeIDs' }
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
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'userIDs' }
					},
					type: {
						kind: 'ListType',
						type: {
							kind: 'NonNullType',
							type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
						}
					}
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'bookmarks' },
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
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filter' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'ids' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'ids' }
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'trackIDs' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'trackIDs' }
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'episodeIDs' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'episodeIDs' }
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'userIDs' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'userIDs' }
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
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'comment' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'track' },
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
																		name: {
																			kind: 'Name',
																			value: 'mediaDuration'
																		}
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
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'episode' },
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
															name: { kind: 'Name', value: 'podcast' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'id' }
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
																		name: {
																			kind: 'Name',
																			value: 'mediaDuration'
																		}
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'title' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'artist' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'genres' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'album' }
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
			}
		}
	]
} as unknown as DocumentNode<BookmarkResultQuery, BookmarkResultQueryVariables>;
