import 'react-native';
import React from 'react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { MediaCachingView } from '../../../src/components/MediaCachingView';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { hasNodeOfType } from '../../helpers/tree';

interface PinCacheStat {
	files: number;
	size: number;
	humanSize: string;
}

let mockStat: PinCacheStat | undefined;
const mockClearPins = jest.fn(async (): Promise<void> => undefined);

jest.mock('../../../src/style/theming', () => ({
	useTheme: () => ({ textColor: '#000000' }),
	staticTheme: { marginSmall: 4, paddingSmall: 4 }
}));

jest.mock('../../../src/services/pin.hooks.ts', () => ({
	usePinCacheStat: (): PinCacheStat | undefined => mockStat
}));

jest.mock('../../../src/services/pin.service.ts', () => ({
	__esModule: true,
	default: { clearPins: async (): Promise<void> => mockClearPins() }
}));

describe('MediaCachingView', () => {
	beforeEach(() => {
		jest.clearAllMocks();
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
			// keep the clear operation pending so the running state stays visible
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
