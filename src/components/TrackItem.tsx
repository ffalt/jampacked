import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {staticTheme} from '../style/theming';
import {JamPlayer} from '../services/player';
import ThemedText from './ThemedText';
import {TrackEntry} from '../services/data';

const styles = StyleSheet.create({
	trackListContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginRight: staticTheme.marginLarge,
		marginLeft: staticTheme.marginLarge,
		height: 46
	},
	trackListNumber: {
		flex: 1
	},
	trackListTitle: {
		flex: 5
	},
	trackListRuntime: {
		flex: 1
	},
	trackNumberStyle: {
		fontSize: staticTheme.fontSizeSmall
	},
	trackSubStyle: {
		fontSize: staticTheme.fontSizeSmall
	},
	trackTitleStyle: {
		fontSize: staticTheme.fontSize
	},
	trackRuntimeStyle: {
		textAlign: 'right',
		fontSize: staticTheme.fontSizeSmall
	}
});

export default class TrackItem extends PureComponent<{ track: TrackEntry }> {

	private playTrack = (): void => {
		JamPlayer.playTrack(this.props.track)
			.catch(e => console.error(e));
	};

	render(): React.ReactElement {
		return (
			<TouchableOpacity onPress={this.playTrack} style={styles.trackListContainer}>
				<View style={styles.trackListNumber}>
					<ThemedText style={styles.trackNumberStyle}>{this.props.track.trackNr}</ThemedText>
				</View>

				<View style={styles.trackListTitle}>
					<ThemedText style={styles.trackTitleStyle} numberOfLines={2}>{this.props.track.title}</ThemedText>
				</View>

				<View style={styles.trackListRuntime}>
					<ThemedText style={styles.trackRuntimeStyle}>{this.props.track.duration}</ThemedText>
				</View>
			</TouchableOpacity>
		);
	}
}
