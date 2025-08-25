import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import React from 'react';
import { JamPlayer } from '../services/player';
import { useTrackPlayerProgressPercent } from '../services/player-api';
import { staticTheme, useTheme } from '../style/theming';

const styles = StyleSheet.create({
	slider: {
		marginTop: staticTheme.margin
	}
});

export const PlayerProgress: React.FC = () => {
	const theme = useTheme();
	const { progress } = useTrackPlayerProgressPercent(300);
	return (
		<Slider
			thumbTintColor={theme.sliderHandle}
			maximumTrackTintColor={theme.inactiveTintColor}
			minimumTrackTintColor={theme.activeTintColor}
			style={styles.slider}
			value={progress}
			step={0.001}
			onSlidingComplete={percent => JamPlayer.seekPercentSync(percent)}
		/>
	);
};
