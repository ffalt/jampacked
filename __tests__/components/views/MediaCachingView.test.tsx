import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { MediaCachingView } from '../../../src/components/MediaCachingView';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { hasNodeOfType } from '../../helpers/tree';
import { usePinCacheStat } from '../../../src/services/pin.hooks';
import pinService from '../../../src/services/pin.service';

jest.mock('../../../src/services/pin.hooks.ts', () => require('../../../__mocks__/services/pin.hooks.ts'));
jest.mock('../../../src/services/pin.service.ts', () => require('../../../__mocks__/services/pin.service.ts'));

interface PinCacheStat {
	files: number;
	size: number;
	humanSize: string;
}

let mockStat: PinCacheStat | undefined;

jest.mocked(usePinCacheStat).mockImplementation(() => mockStat);

const mockClearPins = jest.mocked(pinService.clearPins);

describe('MediaCachingView', () => {
	beforeEach(() => {
		mockStat = { files: 5, size: 2048, humanSize: '2 MB' };
		mockClearPins.mockResolvedValue(undefined);
	});

	describe('stat display', () => {
		it('should show the file count and human size when files exist', async () => {
			const screen = await render(<MediaCachingView />);
			expect(screen.getByText(/Files:/)).toBeTruthy();
			expect(screen.getByText(/2 MB/)).toBeTruthy();
		});

		it('should not show the size when there are no files', async () => {
			mockStat = { files: 0, size: 0, humanSize: '0 B' };
			const screen = await render(<MediaCachingView />);
			expect(screen.getByText(/Files:/)).toBeTruthy();
			expect(screen.queryByText(/0 B/)).toBeNull();
		});

		it('should render without crashing when the stat is undefined', async () => {
			mockStat = undefined;
			const screen = await render(<MediaCachingView />);
			expect(screen.getByText(/Files:/)).toBeTruthy();
		});

		it('should show the clear button', async () => {
			const screen = await render(<MediaCachingView />);
			expect(screen.getByText('Clear')).toBeTruthy();
		});

		it('should not show the spinner while idle', async () => {
			const screen = await render(<MediaCachingView />);
			expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(false);
		});
	});

	describe('clearing', () => {
		it('should clear the media cache when clear is pressed', async () => {
			const screen = await render(<MediaCachingView />);
			await fireEvent.press(screen.getByText('Clear'));
			expect(mockClearPins).toHaveBeenCalledTimes(1);
		});

		it('should show the spinner and removing message while clearing', async () => {
			mockClearPins.mockReturnValue(new Promise<void>(() => undefined));
			const screen = await render(<MediaCachingView />);

			await fireEvent.press(screen.getByText('Clear'));

			expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(true);
			expect(screen.getByText('Removing...')).toBeTruthy();
		});

		it('should return to the idle state after clearing completes', async () => {
			const screen = await render(<MediaCachingView />);

			await fireEvent.press(screen.getByText('Clear'));

			await waitFor(() => {
				expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(false);
			});
			expect(screen.queryByText('Removing...')).toBeNull();
		});
	});
});
