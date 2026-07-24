/**
 * The auth surface `AppNavigator` drives. Tests reach it through the default
 * export (`jamService.auth`) and re-point the individual jest.fn()s.
 */
export const mockJamAuth = {
	check: jest.fn(async (): Promise<void> => undefined),
	isLoggedIn: jest.fn(() => false),
	user: undefined as unknown,
	login: jest.fn(async (): Promise<void> => undefined),
	logout: jest.fn(async (): Promise<void> => undefined)
};

const jamService = {
	auth: mockJamAuth,
	currentUserName: '',
	currentUserID: '',
	currentUserToken: undefined as string | undefined
};

export default jamService;
