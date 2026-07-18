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

export type SeriesResultQueryVariables = Exact<{
	id: string | number;
}>;

export interface SeriesResultQuery {
	series: {
		id: string;
		name: string;
		tracksCount: number;
		artist: { id: string; name: string } | null;
		albums: Array<{
			id: string;
			name: string;
			albumType: Types.AlbumType;
			seriesNr: string | null;
			year: number | null;
		}>;
	};
}

export const SeriesResultDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SeriesResult' },
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
						name: { kind: 'Name', value: 'series' },
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
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'artist' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } }
										]
									}
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'tracksCount' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'albums' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'albumType' }
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'seriesNr' }
											},
											{ kind: 'Field', name: { kind: 'Name', value: 'year' } }
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
} as unknown as DocumentNode<SeriesResultQuery, SeriesResultQueryVariables>;
