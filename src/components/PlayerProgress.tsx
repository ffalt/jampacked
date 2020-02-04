// eslint-disable-next-line max-classes-per-file
import {Dimensions, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import Slider from '@react-native-community/slider';
import React, {PureComponent} from 'react';
import {ProgressComponent, useTrackPlayerProgress} from '../services/player-api';
import {JamPlayer, useCurrentTrackID} from '../services/player';
import {ITheme, staticTheme, useTheme, withTheme} from '../style/theming';
import {SoundCloudWave} from './Waveform';
import {Jam} from '../services/jam';
import dataService from '../services/data';

const dimensionsWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	slider: {
		marginTop: staticTheme.margin
	}
});

interface WaveformProgressProps {
	waveform?: Jam.WaveFormData;
	style?: StyleProp<ViewStyle>;
}

const WaveformProgress: React.FC<WaveformProgressProps> = ({waveform, style}: WaveformProgressProps) => {
	const progress = useTrackPlayerProgress();
	const setTime = (data: number): void => {
		JamPlayer.seekPercent(data)
			.catch(e => console.error(e));
	};
	const pc = progress.duration ? (progress.position / progress.duration) : 0;
	const pcBuffer = progress.duration ? (progress.bufferedPosition / progress.duration) : 0;
	const theme = useTheme();
	return (
		<SoundCloudWave
			waveform={waveform}
			width={dimensionsWidth}
			height={50}
			percentPlayable={pcBuffer}
			percentPlayed={pc}
			style={style}
			colors={theme.waveform}
			setTime={setTime}
		/>
	);
};

class PlayerProgressWaveformLoader extends PureComponent<{ id?: string; style?: StyleProp<ViewStyle>; }> {
	state: { waveform?: Jam.WaveFormData } = {waveform: undefined};

	componentDidMount(): void {
		this.load(this.props.id)
			.catch(e => console.error(e));
	}

	componentDidUpdate(oldProps: { id: string }): void {
		if (oldProps.id !== this.props.id) {
			this.load(this.props.id)
				.catch(e => console.error(e));
		}
	}

	render(): React.ReactElement {
		return (
			<WaveformProgress style={this.props.style} waveform={this.state.waveform}/>
		);
	}

	private async load(id?: string): Promise<void> {
		this.setState({waveform: undefined});
		if (!id) {
			return;
		}
		const waveform = await dataService.waveform(id);
		this.setState({waveform});
	}
}

export const PlayerWaveFormProgress: React.FC = () => {
	const id = useCurrentTrackID();
	return (
		<PlayerProgressWaveformLoader id={id}/>
	);
};

class PlayerProgress extends ProgressComponent<{ theme: ITheme }> {

	private seek = (data: number): void => {
		JamPlayer.seekPercent(data)
			.catch(e => console.error(e));
	};

	render(): React.ReactElement {
		return (
			<Slider
				thumbTintColor={this.props.theme.sliderHandle}
				maximumTrackTintColor={this.props.theme.inactiveTintColor}
				minimumTrackTintColor={this.props.theme.activeTintColor}
				style={styles.slider}
				value={this.getProgress()}
				onSlidingComplete={this.seek}
			/>
		);
	}
}

export default withTheme(PlayerProgress);
