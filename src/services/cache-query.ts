import { DocumentNode } from 'graphql';
import type { OperationVariables } from '@apollo/client';

export function buildCacheID<TVariables extends OperationVariables>(query: DocumentNode, variables?: TVariables): string | undefined {
	const definition = query.definitions.find(d => d.kind === 'OperationDefinition');
	if (definition) {
		return (definition as any).name.value + (variables ? JSON.stringify(variables) : '');
	}
}
