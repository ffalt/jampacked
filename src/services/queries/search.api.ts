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

export type SearchTracksResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchTracksResultQuery {
	tracks: {
		total: number;
		skip: number | null;
		items: Array<{
			id: string;
			name: string;
			tag: { artist: string | null } | null;
		}>;
	};
}

export type SearchSeriesResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchSeriesResultQuery {
	serieses: {
		total: number;
		skip: number | null;
		items: Array<{ id: string; name: string; albumsCount: number }>;
	};
}

export type SearchPodcastsResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchPodcastsResultQuery {
	podcasts: {
		total: number;
		skip: number | null;
		items: Array<{ id: string; name: string; episodesCount: number }>;
	};
}

export type SearchPlaylistsResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchPlaylistsResultQuery {
	playlists: {
		total: number;
		skip: number | null;
		items: Array<{ id: string; name: string; entriesCount: number }>;
	};
}

export type SearchFoldersResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchFoldersResultQuery {
	folders: {
		total: number;
		skip: number | null;
		items: Array<{
			id: string;
			name: string;
			folderType: Types.FolderType;
			childrenCount: number;
			tracksCount: number;
		}>;
	};
}

export type SearchEpisodesResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchEpisodesResultQuery {
	episodes: {
		total: number;
		skip: number | null;
		items: Array<{ id: string; name: string; date: string }>;
	};
}

export type SearchArtistsResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchArtistsResultQuery {
	artists: {
		total: number;
		skip: number | null;
		items: Array<{ id: string; name: string; albumsCount: number }>;
	};
}

export type SearchAlbumsResultQueryVariables = Exact<{
	query: string;
	take?: number | null | undefined;
	skip?: number | null | undefined;
}>;

export interface SearchAlbumsResultQuery {
	albums: {
		total: number;
		skip: number | null;
		items: Array<{ id: string; name: string; artist: { name: string } }>;
	};
}

export const SearchTracksResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchTracksResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
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
												name: { kind: 'Name', value: 'tag' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'artist' }
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
	SearchTracksResultQuery,
	SearchTracksResultQueryVariables
>;
export const SearchSeriesResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchSeriesResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
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
												name: { kind: 'Name', value: 'albumsCount' }
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
	SearchSeriesResultQuery,
	SearchSeriesResultQueryVariables
>;
export const SearchPodcastsResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchPodcastsResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
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
												name: { kind: 'Name', value: 'episodesCount' }
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
	SearchPodcastsResultQuery,
	SearchPodcastsResultQueryVariables
>;
export const SearchPlaylistsResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchPlaylistsResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
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
												name: { kind: 'Name', value: 'entriesCount' }
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
	SearchPlaylistsResultQuery,
	SearchPlaylistsResultQueryVariables
>;
export const SearchFoldersResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchFoldersResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
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
												name: { kind: 'Name', value: 'childrenCount' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'tracksCount' }
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
	SearchFoldersResultQuery,
	SearchFoldersResultQueryVariables
>;
export const SearchEpisodesResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchEpisodesResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'items' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'date' } }
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
	SearchEpisodesResultQuery,
	SearchEpisodesResultQueryVariables
>;
export const SearchArtistsResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchArtistsResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
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
												name: { kind: 'Name', value: 'albumsCount' }
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
	SearchArtistsResultQuery,
	SearchArtistsResultQueryVariables
>;
export const SearchAlbumsResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchAlbumsResult' },
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
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
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
								{ kind: 'Field', name: { kind: 'Name', value: 'skip' } },
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
												name: { kind: 'Name', value: 'artist' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'name' }
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
	SearchAlbumsResultQuery,
	SearchAlbumsResultQueryVariables
>;
