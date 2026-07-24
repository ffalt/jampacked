import type { Auth } from '../src/services/jam.auth.ts';

/**
 * The auth object the `jam.auth` manual mock hands back from `useAuth()`.
 *
 * Reached through `jest.requireMock` rather than by calling `useAuth()` in the
 * test body: it is the same module instance the component under test sees, and
 * it keeps the react-hooks lint rule happy (a hook must not be called outside a
 * component). The test file still needs its own `jest.mock('.../jam.auth.ts')`.
 */
export function mockAuth(): Auth {
	const module_ = jest.requireMock<typeof import('../src/services/jam.auth.ts')>('../src/services/jam.auth.ts');
	return module_.useAuth();
}
