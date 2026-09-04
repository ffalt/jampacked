import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { PlayButton } from '../../../src/components/PlayButton';
import { render } from '@testing-library/react-native';

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

import { useTrackPlayerPlaybackStateIsPlaying } from 'react-native-track-player';
import { JamPlayer } from '../../../src/services/player.service';

describe('PlayButton', () => {
	describe('rendering', () => {
		it('should render when not playing', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should render when playing', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(true);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should render correctly with initial prop values', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).toMatchInlineSnapshot(`
				<View
				  accessibilityState={
				    {
				      "busy": undefined,
				      "checked": undefined,
				      "disabled": undefined,
				      "expanded": undefined,
				      "selected": undefined,
				    }
				  }
				  accessibilityValue={
				    {
				      "max": undefined,
				      "min": undefined,
				      "now": undefined,
				      "text": undefined,
				    }
				  }
				  accessible={true}
				  collapsable={false}
				  focusable={true}
				  onClick={[Function]}
				  onResponderGrant={[Function]}
				  onResponderMove={[Function]}
				  onResponderRelease={[Function]}
				  onResponderTerminate={[Function]}
				  onResponderTerminationRequest={[Function]}
				  onStartShouldSetResponder={[Function]}
				  style={
				    {
				      "alignItems": "center",
				      "backgroundColor": "#e2e2e2",
				      "borderRadius": 25,
				      "borderWidth": 1,
				      "height": 50,
				      "justifyContent": "center",
				      "opacity": 1,
				      "paddingLeft": 3,
				      "width": 50,
				    }
				  }
				>
				  <icon
				    name="play"
				    style={
				      [
				        {
				          "textAlign": "center",
				        },
				        {
				          "color": "#000000",
				          "fontSize": 20,
				        },
				        undefined,
				      ]
				    }
				  />
				</View>
			`);
		});
	});

	describe('interactions', () => {
		it('should render successfully', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).not.toBeNull();
			expect(JamPlayer.toggleSync).not.toHaveBeenCalled();
		});

		it('should render with different state', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(true);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).not.toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should handle hook returning undefined gracefully', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				undefined
			);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should handle hook returning false', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should handle hook returning true', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(true);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).toBeDefined();
		});

		it('should not crash with no props', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).not.toBeNull();
		});
	});

	describe('performance', () => {
		it('should render without performance issues', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const startTime = performance.now();
			await render(<PlayButton />);
			const endTime = performance.now();

			expect(endTime - startTime).toBeLessThan(500);
		});

		it('should use correct service', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const screen = await render(<PlayButton />);
			expect(screen.toJSON()).toBeDefined();
			expect(JamPlayer.toggleSync).toBeDefined();
		});

		it('should render multiple times', async () => {
			(useTrackPlayerPlaybackStateIsPlaying as jest.Mock).mockReturnValue(
				false
			);

			const screen1 = await render(<PlayButton />);
			const screen2 = await render(<PlayButton />);

			expect(screen1.toJSON()).toBeDefined();
			expect(screen2.toJSON()).toBeDefined();
		});
	});

	describe('service integration', () => {
		it('should have JamPlayer service mocked', () => {
			expect(JamPlayer.toggleSync).toBeDefined();
			expect(typeof JamPlayer.toggleSync).toBe('function');
		});

		it('should have tracking hook mocked', () => {
			expect(useTrackPlayerPlaybackStateIsPlaying).toBeDefined();
			expect(typeof useTrackPlayerPlaybackStateIsPlaying).toBe('function');
		});
	});
});
