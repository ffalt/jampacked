import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlayerTime } from '../../../src/components/PlayerTime';
import { useTrackPlayerProgressMS } from 'react-native-track-player';

let mockProgress: { position: number; duration: number } = { position: 0, duration: 0 };

jest.mocked(useTrackPlayerProgressMS).mockImplementation(() => mockProgress);

describe('PlayerTime', () => {
	beforeEach(() => {
		mockProgress = { position: 0, duration: 0 };
	});

	it('displays the current position and total duration as MM:SS', async () => {
		mockProgress = { position: 65_000, duration: 185_000 };
		const screen = await render(<PlayerTime />);
		expect(screen.getByText('01:05')).toBeTruthy();
		expect(screen.getByText('03:05')).toBeTruthy();
	});

	it('shows 00:00 for both values at the start', async () => {
		mockProgress = { position: 0, duration: 0 };
		const screen = await render(<PlayerTime />);
		expect(screen.getAllByText('00:00')).toHaveLength(2);
	});

	it('formats an hour-scale duration with hours', async () => {
		mockProgress = { position: 0, duration: 3_661_000 };
		const screen = await render(<PlayerTime />);
		expect(screen.getByText('1:01:01')).toBeTruthy();
	});
});
