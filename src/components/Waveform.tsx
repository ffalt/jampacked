import React from 'react';
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


interface Position {
	chunks: Array<Array<number>>,
	percentPlayed: number,
	percentPlayable: number,
}

function getColor(inverse: boolean, bar: number, position: Position, colors: Colors): string {
	if (bar / position.chunks.length < position.percentPlayed) {
		return inverse ? colors.activeInverse : colors.active;
	}
	if (bar / position.chunks.length < position.percentPlayable) {
		return inverse ? colors.activePlayableInverse : colors.activePlayable;
	}
	return inverse ? colors.inactiveInverse : colors.inactive;
}

interface WaveFormViewProps {
	height: number;
	width: number;
	inverse: boolean;
	position: Position;
	colors: Colors;
	scaleFunc: (value: number) => number;
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

const WaveformView: React.FC<WaveFormViewProps> = (props: WaveFormViewProps) => {
	const {
		position,
		colors,
		height,
		width,
		setTime,
		inverse,
		scaleFunc
	} = props;
	const time = (i: number): void => {
		setTime(i / position.chunks.length);
	};
	const bars = position.chunks.map((c, i) => (
		<TouchableOpacity key={i.toString()} onPress={(): void => time(i)}>
			<View style={[styles.waveformBar,
				{
					backgroundColor: getColor(inverse, i, position, colors),
					height: scaleFunc(mean(c) as number)
				}
			]}
			/>
		</TouchableOpacity>
	));
	return (
		<View style={[styles.waveform, {height, width}, inverse && styles.waveformInverse]}>
			{bars}
		</View>
	);
};

export class SoundCloudWave extends React.PureComponent<WaveFormProps> {

	render(): JSX.Element {
		const {
			height,
			width,
			percentPlayed,
			percentPlayable,
			setTime,
			colors,
			waveform,
			style
		} = this.props;
		const channels = [];
		if (waveform) {
			let wfHeight = 1;
			let wfWidth = 1;
			const wf = WaveformData.create(waveform);
			if (waveform) {
				wfWidth = waveform.data.length / 2;
				wfHeight = waveform.sample_rate / 2;
			}
			const channelsHeight = height / 2;
			const scaleLinearHeightHigh = scaleLinear().domain([0, wfHeight]).range([0, channelsHeight]);
			const scaleLinearHeightLow = scaleLinear().domain([-wfHeight, 0]).range([channelsHeight, 0]);
			const refWith = (width - 40) || 1;
			const chunkNr = wfWidth / (refWith / 3);
			const positionHigh: Position = {
				chunks: chunk(wf.channel(0).max_array(), chunkNr),
				percentPlayed,
				percentPlayable
			};
			channels.push((
				<WaveformView
					key="high"
					scaleFunc={scaleLinearHeightHigh}
					position={positionHigh}
					colors={colors}
					height={channelsHeight}
					width={width}
					setTime={setTime}
					inverse={true}
				/>
			));
			const positionLow: Position = {
				chunks: chunk(wf.channel(0).min_array(), chunkNr),
				percentPlayed,
				percentPlayable
			};
			channels.push((
				<WaveformView
					key="low"
					scaleFunc={scaleLinearHeightLow}
					position={positionLow}
					colors={colors}
					height={channelsHeight}
					width={width}
					setTime={setTime}
					inverse={false}
				/>
			));
		}
		return (
			<View style={[styles.container, {height}, style]}>
				{channels}
			</View>
		);
	}
}

//
// SoundCloudWave.defaultProps = {
// 	percentPlayable: 0,
// 	height: 50,
// 	width: dimensionsWidth,
// 	active: '#FF1844',
// 	activeInverse: '#4F1224',
// 	activePlayable: '#1b1b26',
// 	activePlayableInverse: '#131116',
// 	inactive: '#424056',
// 	inactiveInverse: '#1C1A27',
// };
//
// SoundCloudWave.propTypes = ;
