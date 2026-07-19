import 'react-native';
import React from 'react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { CachingView } from '../../../src/components/CachingView';
import { render, fireEvent } from '@testing-library/react-native';
import { hasNodeOfType } from '../../helpers/tree';

interface CacheState {
	isRunning: boolean;
	isStopped: boolean;
	message: string;
}

const mockFill = jest.fn();
const mockClear = jest.fn();
const mockStop = jest.fn();
let mockState: CacheState;

jest.mock('../../../src/style/theming', () => ({
	useTheme: () => ({ textColor: '#000000' }),
	staticTheme: { marginSmall: 4, paddingSmall: 4 }
}));

jest.mock('../../../src/services/cache.hooks.ts', () => ({
	useCacheManagement: (): [() => void, () => void, () => void, CacheState] => [mockFill, mockClear, mockStop, mockState]
}));

describe('CachingView', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockState = { isRunning: false, isStopped: false, message: '' };
	});

	describe('idle state', () => {
		it('should show the title', async () => {
			const screen = await render(<CachingView title="Optimize cache" />);
			expect(screen.getByText('Optimize cache')).toBeTruthy();
		});

		it('should show the optimize and clear buttons', async () => {
			const screen = await render(<CachingView title="Cache" />);
			expect(screen.getByText('Optimize')).toBeTruthy();
			expect(screen.getByText('Clear')).toBeTruthy();
		});

		it('should not show the spinner or stop button', async () => {
			const screen = await render(<CachingView title="Cache" />);
			expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(false);
			expect(screen.queryByText('Stop')).toBeNull();
		});
	});

	describe('running state', () => {
		beforeEach(() => {
			mockState = { isRunning: true, isStopped: false, message: 'Caching 5/10' };
		});

		it('should show the loading spinner', async () => {
			const screen = await render(<CachingView title="Cache" />);
			expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(true);
		});

		it('should show the progress message', async () => {
			const screen = await render(<CachingView title="Cache" />);
			expect(screen.getByText('Caching 5/10')).toBeTruthy();
		});

		it('should show the stop button and hide optimize/clear', async () => {
			const screen = await render(<CachingView title="Cache" />);
			expect(screen.getByText('Stop')).toBeTruthy();
			expect(screen.queryByText('Optimize')).toBeNull();
			expect(screen.queryByText('Clear')).toBeNull();
		});
	});

	describe('interactions', () => {
		it('should start caching when optimize is pressed', async () => {
			const screen = await render(<CachingView title="Cache" />);
			await fireEvent.press(screen.getByText('Optimize'));
			expect(mockFill).toHaveBeenCalledTimes(1);
		});

		it('should clear the cache when clear is pressed', async () => {
			const screen = await render(<CachingView title="Cache" />);
			await fireEvent.press(screen.getByText('Clear'));
			expect(mockClear).toHaveBeenCalledTimes(1);
		});

		it('should stop caching when stop is pressed', async () => {
			mockState = { isRunning: true, isStopped: false, message: 'Caching' };
			const screen = await render(<CachingView title="Cache" />);
			await fireEvent.press(screen.getByText('Stop'));
			expect(mockStop).toHaveBeenCalledTimes(1);
		});
	});

	describe('state transitions', () => {
		it('should swap from idle controls to running controls', async () => {
			const screen = await render(<CachingView title="Cache" />);
			expect(screen.getByText('Optimize')).toBeTruthy();
			expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(false);

			mockState = { isRunning: true, isStopped: false, message: 'Caching 1/3' };
			await screen.rerender(<CachingView title="Cache" />);

			expect(hasNodeOfType(screen.toJSON(), 'ActivityIndicator')).toBe(true);
			expect(screen.getByText('Caching 1/3')).toBeTruthy();
			expect(screen.queryByText('Optimize')).toBeNull();
		});
	});
});
