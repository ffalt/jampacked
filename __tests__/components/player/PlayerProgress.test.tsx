import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlayerProgress } from '../../../src/components/PlayerProgress';
import { JamPlayer } from '../../../src/services/player.service';
import { getTheme } from '../../../src/style/theming';
import { useTrackPlayerProgressPercent } from 'react-native-track-player';

const theme = getTheme('light');

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

let mockProgress = 0;

jest.mocked(useTrackPlayerProgressPercent).mockImplementation((() => ({ progress: mockProgress })) as never);

interface SliderProps {
	value: number;
	thumbTintColor: string;
	minimumTrackTintColor: string;
	maximumTrackTintColor: string;
	onSlidingComplete: (percent: number) => void;
}

let mockSliderProps: SliderProps | undefined;

jest.mock('@react-native-community/slider', () => ({
	__esModule: true,
	default: (properties: SliderProps): null => {
		mockSliderProps = properties;
		return null;
	}
}));

describe('PlayerProgress', () => {
	beforeEach(() => {
		mockSliderProps = undefined;
		mockProgress = 0;
	});

	it('sets the slider value to the current progress percent', async () => {
		mockProgress = 0.42;
		await render(<PlayerProgress />);
		expect(mockSliderProps?.value).toBe(0.42);
	});

	it('uses the theme colours for the handle and track', async () => {
		await render(<PlayerProgress />);
		expect(mockSliderProps?.thumbTintColor).toBe(theme.sliderHandle);
		expect(mockSliderProps?.minimumTrackTintColor).toBe(theme.activeTintColor);
		expect(mockSliderProps?.maximumTrackTintColor).toBe(theme.inactiveTintColor);
	});

	it('seeks to the chosen percent when sliding completes', async () => {
		await render(<PlayerProgress />);
		mockSliderProps?.onSlidingComplete(0.75);
		expect(jest.mocked(JamPlayer.seekPercentSync)).toHaveBeenCalledWith(0.75);
	});

	it('handles a progress of 0', async () => {
		mockProgress = 0;
		await render(<PlayerProgress />);
		expect(mockSliderProps?.value).toBe(0);
	});

	it('handles a progress of 1', async () => {
		mockProgress = 1;
		await render(<PlayerProgress />);
		expect(mockSliderProps?.value).toBe(1);
	});
});
