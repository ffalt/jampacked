import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import type { TestInstance } from 'test-renderer';
import { SoundCloudWave } from '../../../src/components/Waveform';
import { Jam } from '../../../src/services/jam';

const colors = { active: '#aaaaaa', activePlayable: '#bbbbbb', inactive: '#cccccc' };

const waveform: Jam.WaveFormData = { version: 2, channels: 1, sample_rate: 44_100, samples_per_pixel: 256, bits: 8, length: 3, data: [-10, 20, -30, 40, -5, 15] };

function bars(screen: Awaited<ReturnType<typeof render>>): Array<TestInstance> {
	return screen.root!.queryAll(node => {
		if (node.type !== 'View') {
			return false;
		}
		const style = StyleSheet.flatten(node.props.style) as { width?: number };
		return style.width === 2;
	});
}

function barColor(bar: TestInstance): string | undefined {
	return (StyleSheet.flatten(bar.props.style) as { backgroundColor?: string }).backgroundColor;
}

async function renderWave(overrides: Partial<React.ComponentProps<typeof SoundCloudWave>> = {}): ReturnType<typeof render> {
	const properties: React.ComponentProps<typeof SoundCloudWave> = {
		waveform,
		width: 49,
		height: 50,
		percentPlayed: 0.5,
		percentPlayable: 0.8,
		colors,
		setTime: jest.fn(),
		...overrides
	};
	return render(<SoundCloudWave {...properties} />);
}

describe('SoundCloudWave', () => {
	it('renders no bars when there is no waveform', async () => {
		const screen = await renderWave({ waveform: undefined });
		expect(bars(screen)).toHaveLength(0);
	});

	it('renders one bar per waveform chunk', async () => {
		const screen = await renderWave();
		expect(bars(screen)).toHaveLength(3);
	});

	it('colours bars by the played and playable ratios', async () => {
		const screen = await renderWave({ percentPlayed: 0.5, percentPlayable: 0.8 });
		expect(bars(screen).map(bar => barColor(bar))).toEqual([colors.active, colors.active, colors.activePlayable]);
	});

	it('marks every bar inactive when nothing has played or buffered', async () => {
		const screen = await renderWave({ percentPlayed: 0, percentPlayable: 0 });
		expect(bars(screen).map(bar => barColor(bar))).toEqual([colors.inactive, colors.inactive, colors.inactive]);
	});

	it('seeks to the bar position when a bar is pressed', async () => {
		const setTime = jest.fn();
		const screen = await renderWave({ setTime });
		await fireEvent.press(bars(screen)[1]);
		expect(setTime).toHaveBeenCalledWith(1 / 3);
	});
});
