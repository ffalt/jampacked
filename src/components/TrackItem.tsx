import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {JamPlayer} from '../services/player';
import {ThemedText} from './ThemedText';
import {TrackEntry} from '../services/types';
import {sharedStyles} from '../style/shared';

const styles = StyleSheet.create({
	trackListNumber: {
		flex: 1
	},
	trackListTitle: {
		flex: 7
	},
	trackListRuntime: {
		flex: 1
	}
});

export const TrackItem: React.FC<{ track: TrackEntry, showMenu?: (item: TrackEntry) => void; }> = React.memo(({track, showMenu}) => {

	const playTrack = useCallback((): void => {
		JamPlayer.playTrack(track)
			.catch(e => console.error(e));
	}, [track]);

	const popupMenu = useCallback((): void => {
		if (showMenu) {
			showMenu(track);
		}
	}, [showMenu, track]);

	return (
		<TouchableOpacity
			onPress={playTrack}
			onLongPress={popupMenu}
			style={sharedStyles.item}
		>
			<View style={[sharedStyles.itemSectionLeft, styles.trackListNumber]}>
				<ThemedText style={sharedStyles.itemFooterText}>{track.trackNr}</ThemedText>
			</View>
			<View style={[sharedStyles.itemContent, styles.trackListTitle]}>
				<ThemedText style={sharedStyles.itemText} numberOfLines={2}>{track.title}</ThemedText>
			</View>
			<View style={[sharedStyles.itemSectionRight, styles.trackListRuntime]}>
				<ThemedText style={sharedStyles.itemFooterText}>{track.duration}</ThemedText>
			</View>
		</TouchableOpacity>
	);
});
