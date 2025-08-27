import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DurationText } from './DurationText';
import { staticTheme } from '../style/theming';
import { useTrackPlayerProgressMS } from '../services/player.api.ts';

const styles = StyleSheet.create({
	times: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
		paddingRight: 15
	},
	time: {
		fontSize: staticTheme.fontSizeSmall
	}
});

export const PlayerTime: React.FC = () => {
	const { duration, position } = useTrackPlayerProgressMS();
	return (
		<View style={styles.times}>
			<DurationText style={styles.time} duration={position} />
			<DurationText style={styles.time} duration={duration} />
		</View>
	);
};
