import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {State, TapGestureHandler, TapGestureHandlerStateChangeEvent, TouchableNativeFeedback} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import {JamPlayer} from '../services/player';
import {ThemedText} from './ThemedText';
import {TrackEntry} from '../services/types';
import {sharedStyles} from '../style/shared';
import {staticTheme} from '../style/theming';

const styles = StyleSheet.create({
	trackListCheck: {
		flex: 1,
		maxWidth: 30
	},
	trackListNumber: {
		flex: 1,
		paddingRight: staticTheme.paddingLarge,
		fontSize: staticTheme.fontSizeSmall
	},
	trackListTitle: {
		flex: 7
	},
	trackListCheckBox: {},
	trackListRuntime: {
		flex: 1,
		textAlign: 'right',
		fontSize: staticTheme.fontSizeSmall
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
export const TrackItem: React.FC<{
	track: TrackEntry, displayFunc?: TrackDisplayFunction;
	isSelected?: boolean;
	showMenu?: (item: TrackEntry) => void;
	setSelected?: (item: TrackEntry,) => void;
}> = React.memo(({track, displayFunc, showMenu, isSelected, setSelected}) => {
	const doubleTap = React.useRef(React.createRef<TapGestureHandler>().current);
	const display = displayFunc ? displayFunc(track) : defaultTrackDisplay(track);

	const setItemSelected = (): void => {
		if (setSelected) {
			setSelected(track);
		}
	};

	// const onSingleTapped = useCallback((event: TapGestureHandlerStateChangeEvent): void => {
	// 	if (event.nativeEvent.state === State.ACTIVE) {
	// 		if (showMenu) {
	// 			showMenu(track);
	// 		}
	// 	}
	// }, [showMenu, track]);

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
		<View style={[styles.trackListRuntime]}>
			<ThemedText style={[sharedStyles.itemFooterText, sharedStyles.itemFooterTextRight]} numberOfLines={1}>{display.column3}</ThemedText>
		</View>
	);

	const onLongPress = (): void => {
		if (showMenu) {
			showMenu(track);
		}
	};

	return (
		<TouchableNativeFeedback
			onPress={setItemSelected}
			onLongPress={onLongPress}
		>
			<View style={sharedStyles.item}>
				<View style={styles.trackListCheck}>
					<CheckBox
						value={isSelected}
						onValueChange={setItemSelected}
						style={styles.trackListCheckBox}
					/>
				</View>
				{column1}
				<TapGestureHandler
					ref={doubleTap}
					onHandlerStateChange={onDoubleTapped}
					numberOfTaps={2}>
					<View style={[sharedStyles.itemContent, styles.trackListTitle]}>
						<ThemedText style={sharedStyles.itemText} numberOfLines={2}>{display.column2title}</ThemedText>
						{subtitle}
					</View>
				</TapGestureHandler>
				{column3}
			</View>
		</TouchableNativeFeedback>
	);
});
