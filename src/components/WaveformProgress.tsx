import React, { useCallback } from 'react';
import { useTheme } from '../style/theming';
import { JamPlayer } from '../services/player.service.ts';
import { SoundCloudWave } from './Waveform';
import { Jam } from '../services/jam';
import { StyleProp, ViewStyle } from 'react-native';
import { useWindowWidth } from '../utils/dimension.hook';
import { useTrackPlayerProgressPercent } from 'react-native-track-player';

interface WaveformProgressProps {
	waveform?: Jam.WaveFormData;
	style?: StyleProp<ViewStyle>;
}

export const WaveformProgress: React.FC<WaveformProgressProps> = ({ waveform, style }) => {
	const { progress, bufferProgress } = useTrackPlayerProgressPercent();
	const theme = useTheme();
	const dimensionsWidth = useWindowWidth();

	const setTime = useCallback((data: number): void => {
		JamPlayer.seekPercent(data)
			.catch(console.error);
	}, []);

	return (
		<SoundCloudWave
			waveform={waveform}
			width={dimensionsWidth}
			height={50}
			percentPlayable={bufferProgress}
			percentPlayed={progress}
			style={style}
			colors={theme.waveform}
			setTime={setTime}
		/>
	);
};
