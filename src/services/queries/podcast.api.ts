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
export type PodcastResultQueryVariables = Exact<{
	id: string | number;
}>;

export interface PodcastResultQuery {
	podcast: {
		id: string;
		name: string;
		description: string | null;
		episodes: Array<{
			id: string;
			name: string;
			date: string;
			duration: number | null;
			tag: {
				title: string | null;
				artist: string | null;
				genres: Array<string> | null;
			} | null;
		}>;
	};
}

export const PodcastResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'PodcastResult' },
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
						name: { kind: 'Name', value: 'podcast' },
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
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'description' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'episodes' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'date' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'duration' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'tag' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
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
} as unknown as DocumentNode<PodcastResultQuery, PodcastResultQueryVariables>;
