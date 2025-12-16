/**

	based on https://github.com/pritishvaidya/react-native-soundcloud-waveform
 	LICENSE: MIT

 */
import React, { useCallback, useMemo } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { scaleLinear } from 'd3-scale';
import { mean } from 'd3-array';
import chunk from 'lodash.chunk';
import WaveformData from 'waveform-data';
import { Jam } from '../services/jam';

interface Colors {
	active: string;
	activePlayable: string;
	inactive: string;
}

interface WaveFormProps {
	waveform?: Jam.WaveFormData;
	percentPlayed: number;
	percentPlayable: number;
	height: number;
	width: number;
	colors: Colors;
	setTime: (time: number) => void;
	style?: StyleProp<ViewStyle>;
}

function getColor(bar: number, chunksLength: number, percentPlayed: number, percentPlayable: number, colors: Colors): string {
	if (bar / chunksLength < percentPlayed) {
		return colors.active;
	}
	if (bar / chunksLength < percentPlayable) {
		return colors.activePlayable;
	}
	return colors.inactive;
}

interface WaveFormBar {
	top: number;
	height: number;
}

interface WaveFormViewProps {
	height: number;
	width: number;
	bars: { items: Array<WaveFormBar> };
	percentPlayed: number;
	percentPlayable: number;
	colors: Colors;
	setTime: (time: number) => void;
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center'
	},
	waveform: {
		justifyContent: 'center',
		flexDirection: 'row'
	},
	waveformBar: {
		width: 2,
		marginRight: 1
	}
});

interface WaveformViewBarProps {
	top: number;
	height: number;
	index: number;
	backgroundColor: string;
	goToIndex: (index: number) => void;
}

const WaveformViewBar: React.FC<WaveformViewBarProps> = React.memo((
	{
		top,
		height,
		backgroundColor,
		goToIndex,
		index
	}
) => {
	const goTime = useCallback((): void => {
		goToIndex(index);
	}, [goToIndex, index]);

	return (
		<TouchableOpacity onPress={goTime}>
			<View style={[styles.waveformBar, { backgroundColor, height, marginTop: top }]} />
		</TouchableOpacity>
	);
});

const WaveformView: React.FC<WaveFormViewProps> = React.memo((
	{
		bars,
		percentPlayed, percentPlayable,
		colors,
		height,
		width,
		setTime
	}
) => {
	const goToIndex = useCallback((index: number) => {
		setTime(index / bars.items.length);
	}, [setTime, bars.items.length]);

	return (
		<View style={[styles.waveform, { height, width }]}>
			{bars.items.map((bar, index) => {
				const backgroundColor = getColor(index, bars.items.length, percentPlayed, percentPlayable, colors);
				return (
					<WaveformViewBar
						key={index.toString()}
						index={index}
						top={bar.top}
						height={bar.height}
						goToIndex={goToIndex}
						backgroundColor={backgroundColor}
					/>
				);
			})}
		</View>
	);
});

const buildBars = (domain: Array<number>, range: Array<number>, chunks: Array<Array<number>>): { items: Array<number> } => {
	const scaleFunction = scaleLinear().domain(domain).range(range);
	return {
		items: chunks.map(c => scaleFunction(mean(c)!))
	};
};

export const SoundCloudWave: React.FC<WaveFormProps> = (
	{
		height,
		width,
		percentPlayed,
		percentPlayable,
		setTime,
		colors,
		waveform,
		style
	}
) => {
	const bars = useMemo(() => {
		if (!waveform) return { items: [] } as { items: Array<WaveFormBar> };
		let wfHeight = 1;
		let wfWidth = 1;
		const wf = WaveformData.create(waveform);
		wfWidth = waveform.data.length / 2;
		wfHeight = waveform.sample_rate / 2;
		const rWidth = (width - 40) || 1;
		const chunkNr = wfWidth / (rWidth / 3);
		const chunksHigh = chunk(wf.channel(0).max_array(), chunkNr);
		const chunksLow = chunk(wf.channel(0).min_array(), chunkNr);
		const barsHigh = buildBars([0, wfHeight], [0, height / 2], chunksHigh);
		const barsLow = buildBars([-wfHeight, 0], [height / 2, 0], chunksLow);
		const items = barsHigh.items.map((high, index) => {
			const low = barsLow.items[index];
			return {
				// high, low,
				top: (height / 2) - high,
				height: (high + low)
			};
		});
		return { items };
	}, [waveform, height, width]);

	return (
		<View style={[styles.container, { height }, style]}>
			<WaveformView
				bars={bars}
				colors={colors}
				percentPlayed={percentPlayed}
				percentPlayable={percentPlayable}
				height={height}
				width={width}
				setTime={setTime}
			/>
		</View>
	);
};
