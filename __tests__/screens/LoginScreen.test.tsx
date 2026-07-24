import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import { LoginScreen } from '../../src/screens/LoginScreen';

import { mockAuth } from '../../__mocks__/auth-mock.ts';
import { LoginButton } from '../../src/components/LoginButton';
import { lastProps } from '../../__mocks__/mock-props.ts';
import storageService from '../../src/services/storage.service';
import { screenProps } from '../../__mocks__/screen-props.ts';

jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => {
	const RN = require('react-native') as typeof import('react-native');
	return { __esModule: true, default: RN.View };
});

jest.mock('../../src/services/jam.auth.ts', () => require('../../__mocks__/services/jam.auth.ts'));
jest.mock('../../src/services/storage.service.ts', () => require('../../__mocks__/services/storage.service.ts'));

const mockLogin = jest.mocked(mockAuth().login);
const mockGetStored = jest.mocked(storageService.getStored);
const mockSetStored = jest.mocked(storageService.setStored);

jest.mock('../../src/components/Logo', () => require('../../__mocks__/components/Logo.tsx'));
jest.mock('../../src/components/ThemedIcon', () => require('../../__mocks__/components/ThemedIcon.tsx'));

jest.mock('../../src/components/LoginButton', () => require('../../__mocks__/components/LoginButton.tsx'));

const mockLoginPress = (): (() => void) | undefined => lastProps<{ onPress: () => void }>(LoginButton)?.onPress;

type Screen = Awaited<ReturnType<typeof render>>;

async function setup(): Promise<Screen> {
	const screen = await render(<LoginScreen {...screenProps(LoginScreen)} />);
	await screen.findByText('Login');
	return screen;
}

async function enter(screen: Screen, server: string, user: string, password: string): Promise<void> {
	await act(async () => {
		await fireEvent.changeText(screen.getByPlaceholderText('Server'), server);
		await fireEvent.changeText(screen.getByPlaceholderText('User'), user);
		await fireEvent.changeText(screen.getByPlaceholderText('Password'), password);
	});
}

async function pressLogin(): Promise<void> {
	await act(async () => {
		mockLoginPress()?.();
	});
}

describe('LoginScreen', () => {
	beforeEach(() => {
		mockLogin.mockResolvedValue(undefined);
		mockGetStored.mockResolvedValue(undefined);
		mockSetStored.mockResolvedValue(undefined);
	});

	it('renders the server / user / password inputs and the login button', async () => {
		const screen = await setup();
		expect(screen.getByPlaceholderText('Server')).toBeTruthy();
		expect(screen.getByPlaceholderText('User')).toBeTruthy();
		expect(screen.getByPlaceholderText('Password')).toBeTruthy();
		expect(screen.getByText('Login')).toBeTruthy();
	});

	it('pre-fills the last server/user from storage', async () => {
		mockGetStored.mockImplementation(async (key: string) => (key === 'last:server' ? 'http://saved:4040' : 'saved-user'));
		const screen = await setup();
		expect(screen.getByPlaceholderText('Server').props.value).toBe('http://saved:4040');
		expect(screen.getByPlaceholderText('User').props.value).toBe('saved-user');
	});

	it('shows a validation error when a field is empty', async () => {
		const screen = await setup();
		await act(async () => {
			await fireEvent.changeText(screen.getByPlaceholderText('Server'), '');
		});
		await pressLogin();
		expect(screen.getByText('Please provide all fields to login.')).toBeTruthy();
		expect(mockLogin).not.toHaveBeenCalled();
	});

	it('calls auth.login with the entered credentials', async () => {
		const screen = await setup();
		await enter(screen, 'http://host:4040', 'bob', 'secret');
		await pressLogin();
		expect(mockLogin).toHaveBeenCalledWith('http://host:4040', 'bob', 'secret');
	});

	it('persists last server/user on a successful login', async () => {
		const screen = await setup();
		await enter(screen, 'http://host:4040', 'bob', 'secret');
		await pressLogin();
		expect(mockSetStored).toHaveBeenCalledWith('last:user', 'bob');
		expect(mockSetStored).toHaveBeenCalledWith('last:server', 'http://host:4040');
	});

	it('shows the error message and stops loading on a failed login', async () => {
		mockLogin.mockRejectedValueOnce(new Error('Bad credentials'));
		const screen = await setup();
		await enter(screen, 'http://host:4040', 'bob', 'secret');
		await pressLogin();
		expect(screen.getByText('Bad credentials')).toBeTruthy();
		expect(screen.getByText('Login')).toBeTruthy();
	});
});
