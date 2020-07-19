import React, {useCallback, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {staticTheme} from '../style/theming';
import {JamPlayer} from '../services/player';
import {ThemedText} from './ThemedText';
import {TrackEntry} from '../services/types';

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

export const TrackItem: React.FC<{ track: TrackEntry, showMenu?: (ref: React.RefObject<any>, item: TrackEntry) => void; }> = React.memo(({track, showMenu}) => {
	const ref = useRef<TouchableOpacity | null>(null);

	const playTrack = useCallback((): void => {
		JamPlayer.playTrack(track)
			.catch(e => console.error(e));
	}, [track]);

	const popupMenu = useCallback((): void => {
		if (showMenu) {
			showMenu(ref, track);
		}
	}, [showMenu, ref, track]);

	return (
		<TouchableOpacity
			ref={ref}
			onPress={playTrack}
			onLongPress={popupMenu}
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
});
