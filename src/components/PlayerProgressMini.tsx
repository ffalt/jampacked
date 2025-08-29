import React from 'react';
import { DimensionValue, StyleSheet, View } from 'react-native';
import { useTheme } from '../style/theming';
import { useTrackPlayerProgressPercent } from 'react-native-track-player';

const styles = StyleSheet.create({
	miniProgress: {
		height: 1
	}
});

export const MiniProgressBar: React.FC = () => {
	const theme = useTheme();
	const { progress } = useTrackPlayerProgressPercent();
	const width: DimensionValue = `${progress * 100}%`;
	return (
		<View style={[styles.miniProgress, { backgroundColor: theme.separator }]}>
			<View style={[styles.miniProgress, { width, backgroundColor: theme.progress }]} />
		</View>
	);
};
