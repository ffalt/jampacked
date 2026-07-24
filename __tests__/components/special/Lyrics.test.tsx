import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { hasNodeOfType } from '../../helpers/tree';
import { Lyrics } from '../../../src/components/Lyrics';
import { ClickLabelIcon } from '../../../src/components/ClickLabelIcon';
import { lastProps } from '../../../__mocks__/mock-props.ts';
import { useLazyTrackLyricsQuery } from '../../../src/services/queries/lyrics';

interface LabelIconProps {
	iconName: string;
	label: string;
	onPress: () => void;
}

jest.mock('../../../src/components/ClickLabelIcon', () => require('../../../__mocks__/components/ClickLabelIcon.tsx'));

const mockGetLyrics = jest.fn();
let mockHookState: { loading: boolean; error?: Error; lyrics?: { lyrics?: string }; called: boolean };

jest.mock('../../../src/services/queries/lyrics');
jest.mocked(useLazyTrackLyricsQuery).mockImplementation(() => [mockGetLyrics, mockHookState] as never);

describe('Lyrics', () => {
	beforeEach(() => {
		mockHookState = { loading: false, called: false };
	});

	it('fetches lyrics when an id is given', async () => {
		await render(<Lyrics id="track-1" />);
		expect(mockGetLyrics).toHaveBeenCalledWith('track-1');
	});

	it('does not fetch when there is no id', async () => {
		await render(<Lyrics />);
		expect(mockGetLyrics).not.toHaveBeenCalled();
	});

	it('shows a spinner while loading', async () => {
		mockHookState = { loading: true, called: true };
		const screen = await render(<Lyrics id="track-1" />);
		expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(true);
		expect(screen.getByText('Searching Lyrics')).toBeTruthy();
	});

	it('shows the lyrics text once loaded', async () => {
		mockHookState = { loading: false, called: true, lyrics: { lyrics: 'la la la' } };
		const screen = await render(<Lyrics id="track-1" />);
		expect(screen.getByText('la la la')).toBeTruthy();
	});

	it('shows a placeholder when the track has no lyrics', async () => {
		mockHookState = { loading: false, called: true, lyrics: {} };
		const screen = await render(<Lyrics id="track-1" />);
		expect(screen.getByText('[No lyrics available]')).toBeTruthy();
	});

	it('shows the error message and a refresh button that refetches', async () => {
		mockHookState = { loading: false, called: true, error: new Error('no network') };
		const screen = await render(<Lyrics id="track-1" />);
		expect(screen.getByText('no network')).toBeTruthy();
		mockGetLyrics.mockClear();
		lastProps<LabelIconProps>(ClickLabelIcon)?.onPress();
		expect(mockGetLyrics).toHaveBeenCalledWith('track-1');
	});
});
