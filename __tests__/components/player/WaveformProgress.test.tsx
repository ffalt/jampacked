import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { WaveformProgress } from '../../../src/components/WaveformProgress';
import { JamPlayer } from '../../../src/services/player.service';
import { Jam } from '../../../src/services/jam';
import { getTheme } from '../../../src/style/theming';
import { useTrackPlayerProgressPercent } from 'react-native-track-player';
import { SoundCloudWave } from '../../../src/components/Waveform';
import { lastProps } from '../../../__mocks__/mock-props.ts';

const theme = getTheme('light');

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

jest.mock('../../../src/utils/dimension.hook', () => require('../../../__mocks__/utils/dimension.hook.ts'));

let mockProgress: { progress: number; bufferProgress: number } = { progress: 0, bufferProgress: 0 };

jest.mocked(useTrackPlayerProgressPercent).mockImplementation(() => mockProgress);

interface WaveProps {
	waveform?: Jam.WaveFormData;
	width: number;
	height: number;
	percentPlayed: number;
	percentPlayable: number;
	colors: { active: string; activePlayable: string; inactive: string };
	setTime: (time: number) => void;
}

jest.mock('../../../src/components/Waveform', () => require('../../../__mocks__/components/Waveform.tsx'));

const waveform: Jam.WaveFormData = { version: 2, channels: 1, sample_rate: 44_100, samples_per_pixel: 256, bits: 8, length: 3, data: [-10, 20, -30, 40, -5, 15] };

describe('WaveformProgress', () => {
	beforeEach(() => {
		mockProgress = { progress: 0, bufferProgress: 0 };
	});

	it('forwards the waveform data', async () => {
		await render(<WaveformProgress waveform={waveform} />);
		expect(lastProps<WaveProps>(SoundCloudWave)?.waveform).toBe(waveform);
	});

	it('uses the window width and a fixed height of 50', async () => {
		await render(<WaveformProgress waveform={waveform} />);
		expect(lastProps<WaveProps>(SoundCloudWave)?.width).toBe(360);
		expect(lastProps<WaveProps>(SoundCloudWave)?.height).toBe(50);
	});

	it('maps playback progress and buffered progress onto the wave', async () => {
		mockProgress = { progress: 0.4, bufferProgress: 0.7 };
		await render(<WaveformProgress waveform={waveform} />);
		expect(lastProps<WaveProps>(SoundCloudWave)?.percentPlayed).toBe(0.4);
		expect(lastProps<WaveProps>(SoundCloudWave)?.percentPlayable).toBe(0.7);
	});

	it('passes the theme waveform colours', async () => {
		await render(<WaveformProgress waveform={waveform} />);
		expect(lastProps<WaveProps>(SoundCloudWave)?.colors).toEqual(theme.waveform);
	});

	it('seeks to the chosen percent through the player', async () => {
		await render(<WaveformProgress waveform={waveform} />);
		lastProps<WaveProps>(SoundCloudWave)?.setTime(0.33);
		expect(jest.mocked(JamPlayer.seekPercent)).toHaveBeenCalledWith(0.33);
	});
});
