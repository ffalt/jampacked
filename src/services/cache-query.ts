import { DocumentNode } from 'graphql';

export function buildCacheID<TVariables>(query: DocumentNode, variables?: TVariables): string | undefined {
	const opDef = query.definitions.find(d => d.kind === 'OperationDefinition');
	if (opDef) {
		return (opDef as any).name.value + (variables ? JSON.stringify(variables) : '');
	}
}
