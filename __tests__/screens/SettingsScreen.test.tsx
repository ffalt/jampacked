import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { SettingsScreen } from '../../src/screens/SettingsScreen';

import { CachingView } from '../../src/components/CachingView';
import { MediaCachingView } from '../../src/components/MediaCachingView';
import { ThemesView } from '../../src/components/ThemesView';
import { UserView } from '../../src/components/UserView';
import { screenProps } from '../../__mocks__/screen-props.ts';

jest.mock('../../src/components/PageHeader', () => require('../../__mocks__/components/PageHeader.tsx'));
jest.mock('../../src/components/CachingView', () => require('../../__mocks__/components/CachingView.tsx'));
jest.mock('../../src/components/MediaCachingView', () => require('../../__mocks__/components/MediaCachingView.tsx'));
jest.mock('../../src/components/ThemesView', () => require('../../__mocks__/components/ThemesView.tsx'));
jest.mock('../../src/components/UserView', () => require('../../__mocks__/components/UserView.tsx'));

const mockCaching = jest.mocked(CachingView);
const mockMediaCaching = jest.mocked(MediaCachingView);
const mockThemes = jest.mocked(ThemesView);
const mockUser = jest.mocked(UserView);

describe('SettingsScreen', () => {
	it('renders the section headers (Cache / Pinned Offline Tracks / Theme / User)', async () => {
		const screen = await render(<SettingsScreen {...screenProps(SettingsScreen)} />);
		expect(screen.getByText('Cache')).toBeTruthy();
		expect(screen.getByText('Pinned Offline Tracks')).toBeTruthy();
		expect(screen.getByText('Theme')).toBeTruthy();
		expect(screen.getByText('User')).toBeTruthy();
	});

	it('renders the CachingView, MediaCachingView, ThemesView and UserView', async () => {
		await render(<SettingsScreen {...screenProps(SettingsScreen)} />);
		expect(mockCaching).toHaveBeenCalledTimes(1);
		expect(mockMediaCaching).toHaveBeenCalledTimes(1);
		expect(mockThemes).toHaveBeenCalledTimes(1);
		expect(mockUser).toHaveBeenCalledTimes(1);
	});
});
