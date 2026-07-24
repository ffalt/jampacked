import type React from 'react';

/**
 * Props for a screen under test whose required navigation props it never reads -
 * the test drives it through a navigator context or mocked query hooks instead.
 *
 * Replaces the older `{...({} as never)}` spread, which TypeScript rejects
 * because `never` is not an object type. The unavoidable cast lives here only.
 */
export function screenProps<P extends object>(_component: React.ComponentType<P>): P {
	return {} as unknown as P;
}

/** As `screenProps`, for a screen that reads `route.params`. */
export function routeProps<P extends object>(_component: React.ComponentType<P>, parameters: unknown): P {
	return { route: { params: parameters } } as unknown as P;
}
