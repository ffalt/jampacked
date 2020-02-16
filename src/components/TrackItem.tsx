import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {staticTheme} from '../style/theming';
import {JamPlayer} from '../services/player';
import ThemedText from './ThemedText';
import {TrackEntry} from '../services/data';

export const trackEntryHeight = 46;

const styles = StyleSheet.create({
	trackListContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginRight: staticTheme.marginLarge,
		marginLeft: staticTheme.marginLarge,
		height: trackEntryHeight
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

export default class TrackItem extends PureComponent<{ track: TrackEntry, showMenu?: (ref: React.RefObject<any>, item: TrackEntry) => void; }> {
	ref = React.createRef<TouchableOpacity>();

	private playTrack = (): void => {
		const {track} = this.props;
		JamPlayer.playTrack(track)
			.catch(e => console.error(e));
	};

	private popupMenu = (): void => {
		const {showMenu, track} = this.props;
		if (showMenu) {
			showMenu(this.ref, track);
		}
	};

	render(): React.ReactElement {
		const {track} = this.props;
		return (
			<TouchableOpacity
				ref={this.ref}
				onPress={this.playTrack}
				onLongPress={this.popupMenu}
				style={styles.trackListContainer}
			>
				<View style={styles.trackListNumber}>
					<ThemedText style={styles.trackNumberStyle}>{track.trackNr}</ThemedText>
				</View>
				<View style={styles.trackListTitle}>
					<ThemedText style={styles.trackTitleStyle} numberOfLines={2}>{track.title}</ThemedText>
				</View>
				<View style={styles.trackListRuntime}>
					<ThemedText style={styles.trackRuntimeStyle}>{track.duration}</ThemedText>
				</View>
			</TouchableOpacity>
		);
	}
}
