/**

	based on https://github.com/pritishvaidya/react-native-soundcloud-waveform
 	LICENSE: MIT

 */
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {scaleLinear} from 'd3-scale';
import {mean} from 'd3-array';
import chunk from 'lodash.chunk';
import WaveformData from 'waveform-data';
import {Jam} from '../services/jam';

interface Colors {
	active: string,
	activeInverse: string,
	activePlayable: string,
	activePlayableInverse: string,
	inactive: string,
	inactiveInverse: string
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

function getColor(inverse: boolean, bar: number, chunksLength: number, percentPlayed: number, percentPlayable: number, colors: Colors): string {
	if (bar / chunksLength < percentPlayed) {
		return inverse ? colors.activeInverse : colors.active;
	}
	if (bar / chunksLength < percentPlayable) {
		return inverse ? colors.activePlayableInverse : colors.activePlayable;
	}
	return inverse ? colors.inactiveInverse : colors.inactive;
}

interface WaveFormViewProps {
	height: number;
	width: number;
	inverse: boolean;
	bars: { items: Array<number> };
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
	waveformInverse: {
		transform: [{rotateX: '180deg'}, {rotateY: '0deg'}]
	},
	waveformBar: {
		width: 2,
		marginRight: 1
	}
});

const WaveformView: React.FC<WaveFormViewProps> = React.memo((
	{
		bars,
		percentPlayed, percentPlayable,
		colors,
		height,
		width,
		setTime,
		inverse
	}) => {

	const time = useCallback((i: number): void => {
		setTime(i / bars.items.length);
	}, [setTime, bars]);
	return (
		<View style={[styles.waveform, {height, width}, inverse && styles.waveformInverse]}>
			{bars.items.map((bar, i) => {
				const backgroundColor = getColor(inverse, i, bars.items.length, percentPlayed, percentPlayable, colors);
				return (
					<TouchableOpacity key={i.toString()} onPress={(): void => time(i)}>
						<View style={[styles.waveformBar,
							{
								backgroundColor,
								height: bar
							}
						]}
						/>
					</TouchableOpacity>
				);
			})}
		</View>
	);
});

const buildBars = (domain: Array<number>, range: Array<number>, chunks: Array<Array<number>>): { items: Array<number> } => {
	const scaleFunc = scaleLinear().domain(domain).range(range);
	return {
		items: chunks.map((c) => {
			return scaleFunc(mean(c) as number);
		})
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
	}) => {
	const [channelHeight, setChannelHeight] = useState<number>(0);
	const [highBars, setHighBars] = useState<{ items: Array<number> }>({items: []});
	const [lowBars, setLowBars] = useState<{ items: Array<number> }>({items: []});

	useEffect(() => {
		setChannelHeight(height / 2);
	}, [height]);

	useEffect(() => {
		if (waveform) {
			let wfHeight = 1;
			let wfWidth = 1;
			const wf = WaveformData.create(waveform as any);
			if (waveform) {
				wfWidth = waveform.data.length / 2;
				wfHeight = waveform.sample_rate / 2;
			}
			const refWith = (width - 40) || 1;
			const chunkNr = wfWidth / (refWith / 3);
			const chunksHigh = chunk(wf.channel(0).max_array(), chunkNr);
			setHighBars(buildBars([0, wfHeight], [0, channelHeight], chunksHigh));
			const chunksLow = chunk(wf.channel(0).min_array(), chunkNr);
			setLowBars(buildBars([-wfHeight, 0], [channelHeight, 0], chunksLow));
		}
	}, [waveform, channelHeight, width]);

	return (
		<View style={[styles.container, {height}, style]}>
			<WaveformView
				key="high"
				bars={highBars}
				colors={colors}
				percentPlayed={percentPlayed}
				percentPlayable={percentPlayable}
				height={channelHeight}
				width={width}
				setTime={setTime}
				inverse={true}
			/>
			<WaveformView
				key="low"
				bars={lowBars}
				colors={colors}
				percentPlayed={percentPlayed}
				percentPlayable={percentPlayable}
				height={channelHeight}
				width={width}
				setTime={setTime}
				inverse={false}
			/>
		</View>
	);
};
