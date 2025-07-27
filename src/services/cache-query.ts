import { DocumentNode } from 'graphql';

export function buildCacheID<TVariables>(query: DocumentNode, variables?: TVariables): string | undefined {
	const definition = query.definitions.find(d => d.kind === 'OperationDefinition');
	if (definition) {
		return (definition as any).name.value + (variables ? JSON.stringify(variables) : '');
	}
}
