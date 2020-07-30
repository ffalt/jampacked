import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTrackPlayerProgress} from '../services/player-api';
import {DurationText} from './DurationText';
import {staticTheme} from '../style/theming';

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
	const {duration, position} = useTrackPlayerProgress();
	return (
		<View style={styles.times}>
			<DurationText style={styles.time} duration={position * 1000}/>
			<DurationText style={styles.time} duration={duration * 1000}/>
		</View>
	);
};
