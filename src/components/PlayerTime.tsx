import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgressComponent} from '../services/player-api';
import DurationText from './DurationText';
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

export default class PlayerTime extends ProgressComponent {
	render(): React.ReactElement {
		const {duration, position} = this.state;
		return (
			<View style={styles.times}>
				<DurationText style={styles.time} duration={position}/>
				<DurationText style={styles.time} duration={duration}/>
			</View>
		);
	}
}
