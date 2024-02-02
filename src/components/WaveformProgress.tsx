import React, {useCallback} from 'react';
import {useTheme} from '../style/theming';
import {JamPlayer} from '../services/player';
import {SoundCloudWave} from './Waveform';
import {Jam} from '../services/jam';
import {StyleProp, ViewStyle} from 'react-native';
import {useWindowWidth} from '../utils/dimension.hook';
import {useTrackPlayerProgressMS} from '../services/player-api';

interface WaveformProgressProps {
	waveform?: Jam.WaveFormData;
	style?: StyleProp<ViewStyle>;
}

export const WaveformProgress: React.FC<WaveformProgressProps> = ({waveform, style}) => {
	const progress = useTrackPlayerProgressMS();
	const theme = useTheme();
	const dimensionsWidth = useWindowWidth();

	const setTime = useCallback((data: number): void => {
		JamPlayer.seekPercent(data)
			.catch(e => console.error(e));
	}, []);

	return (
		<SoundCloudWave
			waveform={waveform}
			width={dimensionsWidth}
			height={50}
			percentPlayable={progress.buffered / progress.duration}
			percentPlayed={progress.position / progress.duration}
			style={style}
			colors={theme.waveform}
			setTime={setTime}
		/>
	);
};
