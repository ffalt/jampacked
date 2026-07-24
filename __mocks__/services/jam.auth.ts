import type { Auth } from '../../src/services/jam.auth.ts';

const actual = jest.requireActual<typeof import('../../src/services/jam.auth.ts')>('../../src/services/jam.auth.ts');

export const mockAuth: Auth = {
	hasUser: true,
	user: undefined,
	currentUserID: jest.fn(() => 'user-1'),
	currentUserName: jest.fn(() => 'Test User'),
	imgSource: jest.fn(() => undefined),
	login: jest.fn(async (): Promise<void> => undefined),
	logout: jest.fn(async (): Promise<void> => undefined)
};

export const defaultAuth = actual.defaultAuth;
export const AuthContext = actual.AuthContext;
export const useAuth = jest.fn((): Auth => mockAuth);
