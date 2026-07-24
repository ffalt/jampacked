import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { UserView } from '../../../src/components/UserView';
import { mockAuth } from '../../../__mocks__/auth-mock.ts';

jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));
jest.mock('../../../src/components/ThemedIcon', () => require('../../../__mocks__/components/ThemedIcon.tsx'));
jest.mock('../../../src/services/jam.auth.ts', () => require('../../../__mocks__/services/jam.auth.ts'));

interface Roles { stream?: boolean; podcast?: boolean; upload?: boolean; admin?: boolean }

const auth = mockAuth();
const mockLogout = jest.mocked(auth.logout);

function setRoles(roles: Roles): void {
	(auth as { user?: unknown }).user = { roles };
}

describe('UserView', () => {
	beforeEach(() => {
		setRoles({ stream: true, podcast: false, upload: false, admin: false });
	});

	it('shows the user name', async () => {
		const screen = await render(<UserView />);
		expect(screen.getByText('Test User')).toBeTruthy();
	});

	it('shows a permission row for each granted role', async () => {
		setRoles({ stream: true, podcast: true, upload: false, admin: true });
		const screen = await render(<UserView />);
		expect(screen.getByText('Stream Audio')).toBeTruthy();
		expect(screen.getByText('Manage Podcasts')).toBeTruthy();
		expect(screen.getByText('Server Administration')).toBeTruthy();
	});

	it('omits permissions the user does not have', async () => {
		setRoles({ stream: true, podcast: false, upload: false, admin: false });
		const screen = await render(<UserView />);
		expect(screen.queryByText('Upload Audio')).toBeNull();
		expect(screen.queryByText('Server Administration')).toBeNull();
	});

	it('logs out when the logout button is pressed', async () => {
		const screen = await render(<UserView />);
		await fireEvent.press(screen.getByText('Logout'));
		expect(mockLogout).toHaveBeenCalledTimes(1);
	});
});
