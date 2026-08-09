/**
 * Helpers for reading props off a component that was replaced by a manual mock
 * in `src/**\/__mocks__`. The manual mocks are plain `jest.fn()` stubs, so the
 * props a test wants to assert on live in `mock.calls`.
 */

function calls(mocked: unknown): Array<Array<unknown>> {
	return (mocked as jest.Mock).mock.calls as Array<Array<unknown>>;
}

// Props of the most recent render, or undefined if it never rendered.
export function lastProps<T>(mocked: unknown): T | undefined {
	const [latest] = calls(mocked).slice(-1);
	return latest === undefined ? undefined : (latest[0] as T);
}

// Props of every render, oldest first.
export function allProps<T>(mocked: unknown): Array<T> {
	return calls(mocked).map(call => call[0] as T);
}
