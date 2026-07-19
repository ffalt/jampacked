interface JsonNode {
	type: string;
	children?: Array<JsonNode | string> | null;
}

/**
 * Recursively searches a `screen.toJSON()` render tree for a host node of the
 * given type (e.g. 'Image', 'ActivityIndicator') and returns whether one exists.
 */
export function hasNodeOfType(tree: unknown, type: string): boolean {
	const node = tree as JsonNode | Array<JsonNode | string> | null;
	if (!node || typeof node === 'string') {
		return false;
	}
	if (Array.isArray(node)) {
		return node.some(child => hasNodeOfType(child, type));
	}
	if (node.type === type) {
		return true;
	}
	return (node.children ?? []).some(child => hasNodeOfType(child, type));
}
