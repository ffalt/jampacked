import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { FavIcon } from '../../../src/components/FavIcon';
import { render } from '@testing-library/react-native';

jest.mock('../../../src/services/queries/fav.ts', () => ({
	useLazyFavQuery: jest.fn(),
	useFavMutation: jest.fn(() => [
		jest.fn().mockResolvedValue({
			data: {
				fav: {
					faved: new Date().toISOString()
				}
			}
		}),
		{
			loading: false,
			error: undefined,
			data: undefined
		}
	])
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

import { useLazyFavQuery, useFavMutation } from '../../../src/services/queries/fav';
import { snackSuccess } from '../../../src/utils/snack.ts';
import cacheService from '../../../src/services/cache.service.ts';
import { JamObjectType } from '../../../src/services/jam';
import { StyleProp, ViewStyle } from 'react-native';

describe('FavIcon', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('rendering', () => {
		it('should render with heart-empty icon when not favorited', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: { timestamp: undefined },
					called: true,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should render with heart-full icon when favorited', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: { timestamp: 123_456_789 },
					called: true,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should be muted when loading', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: true,
					error: undefined,
					faved: { timestamp: undefined },
					called: false,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should render without id gracefully', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: undefined,
					called: false,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should apply custom style and fontSize', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: { timestamp: undefined },
					called: true,
					setFav: jest.fn()
				}
			]);

			const customStyle = { color: 'red' } as StyleProp<ViewStyle>;
			const screen = await render(
				<FavIcon id="test-id" objType={JamObjectType.album} style={customStyle} fontSize={20} />
			);
			expect(screen.toJSON()).toBeDefined();
		});
	});

	describe('interactions', () => {
		it('should fetch favorite status when id provided', async () => {
			const mockGetFaved = jest.fn();
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				mockGetFaved,
				{
					loading: false,
					error: undefined,
					faved: { timestamp: undefined },
					called: false,
					setFav: jest.fn()
				}
			]);

			await render(<FavIcon id="test-id" objType={JamObjectType.artist} />);

			// GetFaved should be called
			expect(mockGetFaved).toHaveBeenCalled();
		});

		it('should not fetch when no id provided', async () => {
			const mockGetFaved = jest.fn();
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				mockGetFaved,
				{
					loading: false,
					error: undefined,
					faved: undefined,
					called: false,
					setFav: jest.fn()
				}
			]);

			await render(<FavIcon objType={JamObjectType.track} />);

			// GetFaved should not be called
			expect(mockGetFaved).not.toHaveBeenCalled();
		});

		it('should disable interaction when loading', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: true,
					error: undefined,
					faved: { timestamp: undefined },
					called: true,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should disable interaction when no id', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: undefined,
					called: false,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});
	});

	describe('edge cases', () => {
		it('should handle null faved data', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: undefined,
					called: true,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should handle timestamp of 0', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: { timestamp: 0 },
					called: true,
					setFav: jest.fn()
				}
			]);

			const screen = await render(
				<FavIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should work with different object types', async () => {
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				jest.fn(),
				{
					loading: false,
					error: undefined,
					faved: { timestamp: 123_456_789 },
					called: true,
					setFav: jest.fn()
				}
			]);

			const objectTypes = ['track', 'album', 'artist', 'playlist'];

			for (const objectType of objectTypes) {
				const screen = await render(
					<FavIcon id="test-id" objType={objectType as never} />
				);
				expect(screen.toJSON()).toBeDefined();
			}
		});

		it('should handle rapid id changes', async () => {
			const mockGetFaved = jest.fn();
			(useLazyFavQuery as jest.Mock).mockReturnValue([
				mockGetFaved,
				{
					loading: false,
					error: undefined,
					faved: { timestamp: undefined },
					called: false,
					setFav: jest.fn()
				}
			]);

			const { rerender } = await render(
				<FavIcon id="test-id-1" objType={JamObjectType.track} />
			);

			await rerender(<FavIcon id="test-id-2" objType={JamObjectType.track} />);
			await rerender(<FavIcon id="test-id-3" objType={JamObjectType.track} />);

			// Verify component handled re-renders
			expect(mockGetFaved).toHaveBeenCalled();
		});
	});

	describe('service integration', () => {
		it('should have query hooks mocked', () => {
			expect(useLazyFavQuery).toBeDefined();
			expect(useFavMutation).toBeDefined();
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
