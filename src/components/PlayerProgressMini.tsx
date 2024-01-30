import React from 'react';
import {DimensionValue, StyleSheet, View} from 'react-native';
import {useTheme} from '../style/theming';
import {useTrackPlayerProgressPercent} from '../services/player-api';

const styles = StyleSheet.create({
	miniProgress: {
		height: 1
	}
});

export const MiniProgressBar: React.FC = () => {
	const theme = useTheme();
	const pc = useTrackPlayerProgressPercent();
	const width: DimensionValue = `${pc * 100}%`;
	return (
		<View style={[styles.miniProgress, {backgroundColor: theme.separator}]}>
			<View style={[styles.miniProgress, {width: width, backgroundColor: theme.progress}]}/>
		</View>
	);
};
