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

export interface TrackDisplay {
	column1?: string;
	column2title: string;
	column2sub?: string;
	column3: string;
}

export type TrackDisplayFunction = (track: TrackEntry) => TrackDisplay;

export const defaultTrackDisplay = (track: TrackEntry): TrackDisplay => {
	return {
		column1: track.trackNr,
		column2title: track.title,
		column3: track.duration
	};
};
export const defaultShowArtistTrackDisplay = (track: TrackEntry): TrackDisplay => {
	return {
		column1: track.trackNr,
		column2title: track.title,
		column2sub: track.artist,
		column3: track.duration
	};
};
export const defaultListTrackDisplay = (track: TrackEntry): TrackDisplay => {
	return {
		column2title: track.title,
		column2sub: track.artist,
		column3: track.duration
	};
};
export const TrackItem: React.FC<{ track: TrackEntry, displayFunc?: TrackDisplayFunction; showMenu?: (item: TrackEntry) => void; }> = React.memo(({track, displayFunc, showMenu}) => {
	const doubleTap = React.useRef(React.createRef<TapGestureHandler>().current);
	const display = displayFunc ? displayFunc(track) : defaultTrackDisplay(track);

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

	const subtitle = display.column2sub && (<ThemedText style={sharedStyles.itemFooterText} numberOfLines={1}>{display.column2sub}</ThemedText>);
	const column1 = display.column1 && (
		<View style={[sharedStyles.itemSectionLeft, styles.trackListNumber]}>
			<ThemedText style={[sharedStyles.itemFooterText, sharedStyles.itemFooterTextRight]} numberOfLines={1}>{display.column1}</ThemedText>
		</View>
	);
	const column3 = display.column3 && (
		<View style={[sharedStyles.itemSectionRight, styles.trackListRuntime]}>
			<ThemedText style={[sharedStyles.itemFooterText, sharedStyles.itemFooterTextRight]} numberOfLines={1}>{display.column3}</ThemedText>
		</View>
	);
	//TODO: implement opacity on press
	return (
		<TapGestureHandler
			waitFor={doubleTap}
			maxDelayMs={200}
			onHandlerStateChange={onSingleTapped}>
			<TapGestureHandler
				ref={doubleTap}
				onHandlerStateChange={onDoubleTapped}
				numberOfTaps={2}>
				<View style={sharedStyles.item}>
					{column1}
					<View style={[sharedStyles.itemContent, styles.trackListTitle]}>
						<ThemedText style={sharedStyles.itemText} numberOfLines={2}>{display.column2title}</ThemedText>
						{subtitle}
					</View>
					{column3}
				</View>
			</TapGestureHandler>
		</TapGestureHandler>
	);
});
