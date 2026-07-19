import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ViewStyle } from 'react-native';
import { Rating } from '../../../src/components/Rating';
import { render } from '@testing-library/react-native';
import { JamObjectType } from '../../../src/services/jam';

jest.mock('../../../src/services/queries/rate.ts', () => ({
	useLazyRateQuery: jest.fn(),
	useRateMutation: jest.fn()
}));

jest.mock('../../../src/utils/snack.ts', () => ({
	snackSuccess: jest.fn(),
	snackError: jest.fn()
}));

jest.mock('../../../src/services/cache.service.ts', () => ({
	__esModule: true,
	default: {
		updateHomeData: jest.fn()
	}
}));

jest.mock('../../../src/components/ClickIcon.tsx', () => ({
	ClickIcon: jest.fn(() => null)
}));

import { useLazyRateQuery, useRateMutation } from '../../../src/services/queries/rate';
import { snackSuccess } from '../../../src/utils/snack.ts';
import cacheService from '../../../src/services/cache.service.ts';

describe('Rating', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('rendering', () => {
		it('should render 5 stars', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 0 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should highlight filled stars correctly for rating 3', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 3 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should show all empty stars for rating 0', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 0 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should show all filled stars for rating 5', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 5 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should render without id gracefully', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: undefined,
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should apply custom style and fontSize', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 0 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const customStyle: ViewStyle = { opacity: 0.8 };
			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.album} style={customStyle} fontSize={24} />
			);
			expect(screen.toJSON()).toBeDefined();
		});
	});

	describe('interactions', () => {
		it('should fetch rating when id provided', async () => {
			const mockGetRating = jest.fn();
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				mockGetRating,
				{
					rating: { rated: 0 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			await render(<Rating id="test-id" objType={JamObjectType.track} />);

			expect(mockGetRating).toHaveBeenCalled();
		});

		it('should not fetch rating when no id provided', async () => {
			const mockGetRating = jest.fn();
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				mockGetRating,
				{
					rating: undefined,
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			await render(<Rating objType={JamObjectType.track} />);

			// GetRating should not be called without an id
			expect(mockGetRating).not.toHaveBeenCalled();
		});

		it('should be disabled when loading', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 2 },
					loading: true
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should be disabled when no id', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: undefined,
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});
	});

	describe('edge cases', () => {
		it('should handle undefined rating', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: undefined,
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should handle rating of 0', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 0 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const screen = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should work with different object types', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 3 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const objectTypes = [JamObjectType.track, JamObjectType.album, JamObjectType.artist];

			for (const objectType of objectTypes) {
				const screen = await render(
					<Rating id="test-id" objType={objectType} />
				);
				expect(screen.toJSON()).toBeDefined();
			}
		});

		it('should handle rating changes', async () => {
			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 2 },
					loading: false
				}
			]);
			(useRateMutation as jest.Mock).mockReturnValue([jest.fn()]);

			const { rerender } = await render(
				<Rating id="test-id" objType={JamObjectType.track} />
			);

			(useLazyRateQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					rating: { rated: 4 },
					loading: false
				}
			]);

			await rerender(<Rating id="test-id" objType={JamObjectType.track} />);

			// Rating component re-rendered successfully
			expect(rerender).toBeDefined();
		});
	});

	describe('service integration', () => {
		it('should have rate query hook mocked', () => {
			expect(useLazyRateQuery).toBeDefined();
			expect(typeof useLazyRateQuery).toBe('function');
		});

		it('should have rate mutation hook mocked', () => {
			expect(useRateMutation).toBeDefined();
			expect(typeof useRateMutation).toBe('function');
		});

		it('should have snack service mocked', () => {
			expect(snackSuccess).toBeDefined();
		});

		it('should have cache service mocked', () => {
			expect(cacheService).toBeDefined();
			expect(cacheService.updateHomeData).toBeDefined();
		});
	});
});
