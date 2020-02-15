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
		this.load();
	}

	componentDidUpdate(prevProps: { id: string }): void {
		const newProps = this.props;
		if (prevProps.id !== newProps.id) {
			this.load();
		}
	}

	render(): React.ReactElement {
		const {style} = this.props;
		const {waveform} = this.state;
		return (<WaveformProgress style={style} waveform={waveform}/>);
	}

	private load(): void {
		this.setState({waveform: undefined});
		const {id} = this.props;
		if (!id) {
			return;
		}
		dataService.waveform(id)
			.then(waveform => {
				this.setState({waveform});
			})
			.catch(e => console.error(e));
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
		const {theme} = this.props;
		return (
			<Slider
				thumbTintColor={theme.sliderHandle}
				maximumTrackTintColor={theme.inactiveTintColor}
				minimumTrackTintColor={theme.activeTintColor}
				style={styles.slider}
				value={this.getProgress()}
				onSlidingComplete={this.seek}
			/>
		);
	}
}

export default withTheme(PlayerProgress);
