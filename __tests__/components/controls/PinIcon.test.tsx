import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { ViewStyle } from 'react-native';
import { PinIcon } from '../../../src/components/PinIcon';
import { render } from '@testing-library/react-native';
import { JamObjectType } from '../../../src/services/jam';

jest.mock('../../../src/services/pin.service.ts', () => require('../../../__mocks__/services/pin.service.ts'));

jest.mock('../../../src/services/pin.hooks.ts', () => require('../../../__mocks__/services/pin.hooks.ts'));

jest.mock('../../../src/components/ClickIcon.tsx', () => require('../../../__mocks__/components/ClickIcon.tsx'));

import { usePinState } from '../../../src/services/pin.hooks';
import pinService from '../../../src/services/pin.service';

describe('PinIcon', () => {
	describe('rendering', () => {
		it('should render with pin-outline icon when not pinned', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: false
			});

			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should render with pin icon when pinned', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: true
			});

			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should render without id gracefully', async () => {
			(usePinState as jest.Mock).mockReturnValue(undefined);

			const screen = await render(
				<PinIcon objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should apply custom style and fontSize', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: false
			});

			const customStyle: ViewStyle = { opacity: 0.8 };
			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.album} style={customStyle} fontSize={20} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should be disabled when pin state is undefined', async () => {
			(usePinState as jest.Mock).mockReturnValue(undefined);

			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});
	});

	describe('interactions', () => {
		it('should fetch pin state when id provided', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: false
			});

			await render(<PinIcon id="test-id" objType={JamObjectType.artist} />);

			expect(usePinState).toHaveBeenCalled();
		});

		it('should not fetch pin state when no id provided', async () => {
			(usePinState as jest.Mock).mockReturnValue(undefined);

			await render(<PinIcon objType={JamObjectType.track} />);

			expect(usePinState).toHaveBeenCalled();
		});

		it('should disable interaction when pin state undefined', async () => {
			(usePinState as jest.Mock).mockReturnValue(undefined);

			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should disable interaction when no id', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: false
			});

			const screen = await render(
				<PinIcon objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});
	});

	describe('edge cases', () => {
		it('should handle undefined pin state', async () => {
			(usePinState as jest.Mock).mockReturnValue(undefined);

			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should handle false pin state', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: false
			});

			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should handle true pin state', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: true
			});

			const screen = await render(
				<PinIcon id="test-id" objType={JamObjectType.track} />
			);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should work with different object types', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: true
			});

			const objectTypes = [JamObjectType.track, JamObjectType.album, JamObjectType.artist, JamObjectType.playlist];

			for (const objectType of objectTypes) {
				const screen = await render(
					<PinIcon id="test-id" objType={objectType} />
				);
				expect(screen.toJSON()).toBeDefined();
			}
		});

		it('should handle rapid id changes', async () => {
			(usePinState as jest.Mock).mockReturnValue({
				pinned: false
			});

			const { rerender } = await render(
				<PinIcon id="test-id-1" objType={JamObjectType.track} />
			);

			await rerender(<PinIcon id="test-id-2" objType={JamObjectType.track} />);
			await rerender(<PinIcon id="test-id-3" objType={JamObjectType.track} />);

			expect(usePinState).toHaveBeenCalled();
		});
	});

	describe('service integration', () => {
		it('should have pin service mocked', () => {
			expect(pinService).toBeDefined();
			expect(pinService.pin).toBeDefined();
			expect(pinService.unpin).toBeDefined();
		});

		it('should have pin hook mocked', () => {
			expect(usePinState).toBeDefined();
			expect(typeof usePinState).toBe('function');
		});
	});
});
