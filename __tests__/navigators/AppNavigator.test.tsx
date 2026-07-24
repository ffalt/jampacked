import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, waitFor } from '@testing-library/react-native';
import { AppNavigator } from '../../src/navigators/AppNavigator';
import { AppRouting } from '../../src/navigators/Routing';
import jamService from '../../src/services/jam.service';

const mockRenderedScreens: Array<string> = [];
jest.mock('@react-navigation/native-stack', () => ({
	createNativeStackNavigator: () => {
		const ReactLocal = require('react') as typeof import('react');
		return {
			Navigator: (properties: { children?: React.ReactNode }): React.ReactNode => ReactLocal.createElement(ReactLocal.Fragment, null, properties.children),
			Screen: (properties: { name: string }): null => {
				mockRenderedScreens.push(properties.name);
				return null;
			}
		};
	}
}));

jest.mock('../../src/services/jam.service', () => require('../../__mocks__/services/jam.service.ts'));

const mockJamAuth = jamService.auth as unknown as {
	check: jest.Mock;
	isLoggedIn: jest.Mock;
	user: unknown;
	login: jest.Mock;
	logout: jest.Mock;
};

const mockHide = jest.fn().mockResolvedValue(undefined);
jest.mock('react-native-bootsplash', () => ({ __esModule: true, default: { hide: async (options?: unknown): Promise<void> => mockHide(options) } }));

jest.mock('../../src/screens/LoadingScreen', () => require('../../__mocks__/screens/LoadingScreen.tsx'));
jest.mock('../../src/screens/LoginScreen', () => require('../../__mocks__/screens/LoginScreen.tsx'));
jest.mock('../../src/navigators/ModalNavigator', () => require('../../__mocks__/navigators/ModalNavigator.tsx'));

describe('AppNavigator', () => {
	beforeEach(() => {
		mockRenderedScreens.length = 0;
		mockJamAuth.check.mockResolvedValue(undefined);
		mockJamAuth.isLoggedIn.mockReturnValue(false);
		mockJamAuth.user = undefined;
	});

	it('shows the LoadingScreen while the auth check is in flight', async () => {
		mockJamAuth.check.mockImplementation(async () => new Promise<void>(() => undefined));
		await render(<AppNavigator />);
		expect(mockRenderedScreens.at(-1)).toBe(AppRouting.LOAD);
	});

	it('shows the login flow when there is no user', async () => {
		mockJamAuth.check.mockResolvedValue(undefined);
		mockJamAuth.isLoggedIn.mockReturnValue(false);
		await render(<AppNavigator />);
		await waitFor(() => {
			expect(mockRenderedScreens.at(-1)).toBe(AppRouting.AUTH);
		});
	});

	it('shows the main app once authenticated (and hides the boot splash)', async () => {
		mockJamAuth.check.mockResolvedValue(undefined);
		mockJamAuth.isLoggedIn.mockReturnValue(true);
		mockJamAuth.user = { id: 'u1', name: 'admin' };
		await render(<AppNavigator />);
		await waitFor(() => {
			expect(mockRenderedScreens.at(-1)).toBe(AppRouting.APP);
		});
		expect(mockHide).toHaveBeenCalled();
	});
});
