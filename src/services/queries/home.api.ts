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
export type HomeResultQueryVariables = Exact<{ [key: string]: never }>;

export interface HomeResultQuery {
	artistsRecent: { items: Array<{ id: string; name: string }> };
	artistsFaved: { items: Array<{ id: string; name: string }> };
	albumsRecent: { items: Array<{ id: string; name: string }> };
	albumsFaved: { items: Array<{ id: string; name: string }> };
	podcasts: { total: number };
	genres: { total: number };
	stats: {
		track: number;
		folder: number;
		series: number;
		artist: number;
		album: number;
		artistTypes: {
			album: number;
			compilation: number;
			artistCompilation: number;
			unknown: number;
			live: number;
			audiobook: number;
			soundtrack: number;
			bootleg: number;
			ep: number;
			single: number;
		};
		albumTypes: {
			album: number;
			compilation: number;
			artistCompilation: number;
			unknown: number;
			live: number;
			audiobook: number;
			soundtrack: number;
			bootleg: number;
			ep: number;
			single: number;
		};
	};
	currentUser: {
		stats: {
			bookmark: number;
			playlist: number;
			favorite: {
				album: number;
				artist: number;
				folder: number;
				series: number;
				track: number;
				albumTypes: {
					album: number;
					artistCompilation: number;
					audiobook: number;
					compilation: number;
					series: number;
					single: number;
					soundtrack: number;
					ep: number;
					live: number;
					bootleg: number;
					unknown: number;
				};
				artistTypes: { album: number };
			};
			played: {
				album: number;
				artist: number;
				folder: number;
				series: number;
				track: number;
				albumTypes: {
					album: number;
					artistCompilation: number;
					audiobook: number;
					compilation: number;
					series: number;
					single: number;
					soundtrack: number;
					ep: number;
					live: number;
					bootleg: number;
					unknown: number;
				};
				artistTypes: { album: number };
			};
		};
	};
}

export const HomeResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'HomeResult' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'artistsRecent' },
						name: { kind: 'Name', value: 'artists' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'list' },
								value: { kind: 'EnumValue', value: 'recent' }
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
												kind: 'ListValue',
												values: [{ kind: 'EnumValue', value: 'album' }]
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
											value: { kind: 'IntValue', value: '5' }
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
						alias: { kind: 'Name', value: 'artistsFaved' },
						name: { kind: 'Name', value: 'artists' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'list' },
								value: { kind: 'EnumValue', value: 'faved' }
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
												kind: 'ListValue',
												values: [{ kind: 'EnumValue', value: 'album' }]
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
											value: { kind: 'IntValue', value: '5' }
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
						alias: { kind: 'Name', value: 'albumsRecent' },
						name: { kind: 'Name', value: 'albums' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'list' },
								value: { kind: 'EnumValue', value: 'recent' }
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
												kind: 'ListValue',
												values: [{ kind: 'EnumValue', value: 'album' }]
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
											value: { kind: 'IntValue', value: '5' }
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
						alias: { kind: 'Name', value: 'albumsFaved' },
						name: { kind: 'Name', value: 'albums' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'list' },
								value: { kind: 'EnumValue', value: 'faved' }
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
												kind: 'ListValue',
												values: [{ kind: 'EnumValue', value: 'album' }]
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
											value: { kind: 'IntValue', value: '5' }
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
											value: { kind: 'IntValue', value: '0' }
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'total' } }
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'genres' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'total' } }
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'stats' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'track' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'folder' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'series' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'artist' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'artistTypes' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'album' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'compilation' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'artistCompilation' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'unknown' }
											},
											{ kind: 'Field', name: { kind: 'Name', value: 'live' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'audiobook' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'soundtrack' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'bootleg' }
											},
											{ kind: 'Field', name: { kind: 'Name', value: 'ep' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'single' } }
										]
									}
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'album' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'albumTypes' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'album' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'compilation' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'artistCompilation' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'unknown' }
											},
											{ kind: 'Field', name: { kind: 'Name', value: 'live' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'audiobook' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'soundtrack' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'bootleg' }
											},
											{ kind: 'Field', name: { kind: 'Name', value: 'ep' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'single' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'currentUser' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'stats' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'bookmark' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'playlist' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'favorite' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'album' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'albumTypes' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'album' }
																	},
																	{
																		kind: 'Field',
																		name: {
																			kind: 'Name',
																			value: 'artistCompilation'
																		}
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'audiobook' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'compilation' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'series' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'single' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'soundtrack' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'ep' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'live' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'bootleg' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'unknown' }
																	}
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'artist' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'artistTypes' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'album' }
																	}
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'folder' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'series' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'track' }
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'played' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'album' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'albumTypes' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'album' }
																	},
																	{
																		kind: 'Field',
																		name: {
																			kind: 'Name',
																			value: 'artistCompilation'
																		}
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'audiobook' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'compilation' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'series' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'single' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'soundtrack' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'ep' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'live' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'bootleg' }
																	},
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'unknown' }
																	}
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'artist' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'artistTypes' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'album' }
																	}
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'folder' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'series' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'track' }
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
} as unknown as DocumentNode<HomeResultQuery, HomeResultQueryVariables>;
