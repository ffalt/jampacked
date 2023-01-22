import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTrackPlayerProgressPercent} from 'react-native-track-player';
import {useTheme} from '../style/theming';

const styles = StyleSheet.create({
	miniProgress: {
		height: 1
	}
});

export const MiniProgressBar: React.FC = () => {
	const theme = useTheme();
	const {progress} = useTrackPlayerProgressPercent();
	const width = `${progress * 100}%`;
	return (
		<View style={[styles.miniProgress, {backgroundColor: theme.separator}]}>
			<View style={[styles.miniProgress, {width, backgroundColor: theme.progress}]}/>
		</View>
	);
};
