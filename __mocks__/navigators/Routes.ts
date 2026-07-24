const actual = jest.requireActual<typeof import('../../src/navigators/Routes.ts')>('../../src/navigators/Routes.ts');

/**
 * Every `JamRouteLinks` builder wrapped in a `jest.fn()` that keeps the real
 * return value, so tests can assert on calls without inventing route shapes.
 */
export const JamRouteLinks = Object.fromEntries(
	Object.entries(actual.JamRouteLinks).map(([name, builder]) => [name, jest.fn(builder as (...args: Array<never>) => unknown)])
) as unknown as typeof actual.JamRouteLinks;
