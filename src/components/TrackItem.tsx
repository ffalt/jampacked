import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {State, TapGestureHandler, TapGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import {JamPlayer} from '../services/player';
import {ThemedText} from './ThemedText';
import {TrackEntry} from '../services/types';
import {sharedStyles} from '../style/shared';
import {staticTheme} from '../style/theming';

const styles = StyleSheet.create({
	trackListNumber: {
		flex: 1,
		maxWidth: 90,
		minWidth: 10,
		paddingRight: staticTheme.paddingLarge
	},
	trackListTitle: {
		flex: 8
	},
	trackListRuntime: {
		maxWidth: 90,
		minWidth: 90,
		flexDirection: 'column',
		justifyContent: 'center',
		paddingLeft: staticTheme.paddingLarge,
		paddingRight: staticTheme.paddingLarge,
		flex: 1
	}
});

export const TrackItem: React.FC<{ track: TrackEntry, showArtist: boolean; showMenu?: (item: TrackEntry) => void; }> = React.memo(({track, showArtist, showMenu}) => {
	const doubleTap = React.useRef(React.createRef<TapGestureHandler>().current);

	const onSingleTapped = useCallback((event: TapGestureHandlerStateChangeEvent): void => {
		if (event.nativeEvent.state === State.ACTIVE) {
			if (showMenu) {
				showMenu(track);
			}
		}
	}, [showMenu, track]);

	const onDoubleTapped = useCallback((event: TapGestureHandlerStateChangeEvent): void => {
		if (event.nativeEvent.state === State.ACTIVE) {
			JamPlayer.playTrack(track)
				.catch(e => console.error(e));
		}
	}, [track]);

	const artistView = showArtist && (<ThemedText style={sharedStyles.itemFooterText} numberOfLines={1}>{track.artist}</ThemedText>);

	//TODO: implement opacity on press
	return (
		<TapGestureHandler
			waitFor={doubleTap}
			onHandlerStateChange={onSingleTapped}>
			<TapGestureHandler
				ref={doubleTap}
				onHandlerStateChange={onDoubleTapped}
				numberOfTaps={2}>
				<View style={sharedStyles.item}>
					<View style={[sharedStyles.itemSectionLeft, styles.trackListNumber]}>
						<ThemedText style={[sharedStyles.itemFooterText, sharedStyles.itemFooterTextRight]} numberOfLines={1}>{track.trackNr}</ThemedText>
					</View>
					<View style={[sharedStyles.itemContent, styles.trackListTitle]}>
						<ThemedText style={sharedStyles.itemText} numberOfLines={2}>{track.title}</ThemedText>
						{artistView}
					</View>
					<View style={[sharedStyles.itemSectionRight, styles.trackListRuntime]}>
						<ThemedText style={[sharedStyles.itemFooterText, sharedStyles.itemFooterTextRight]} numberOfLines={1}>{track.duration}</ThemedText>
					</View>
				</View>
			</TapGestureHandler>
		</TapGestureHandler>
	);
});
