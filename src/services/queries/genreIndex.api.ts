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
export type GenreIndexResultQueryVariables = Exact<{ [key: string]: never }>;

export interface GenreIndexResultQuery {
	genreIndex: {
		groups: Array<{
			name: string;
			items: Array<{
				id: string;
				name: string;
				albumCount: number;
				artistCount: number;
				trackCount: number;
			}>;
		}>;
	};
}

export const GenreIndexResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GenreIndexResult' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'genreIndex' },
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
															name: { kind: 'Name', value: 'albumCount' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'artistCount' }
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'trackCount' }
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
	GenreIndexResultQuery,
	GenreIndexResultQueryVariables
>;
