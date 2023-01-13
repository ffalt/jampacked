import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {State, TapGestureHandler, TapGestureHandlerStateChangeEvent, TouchableNativeFeedback} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import {ThemedText} from './ThemedText';
import {TrackEntry} from '../services/types';
import {sharedStyles} from '../style/shared';
import {staticTheme, useTheme} from '../style/theming';

const styles = StyleSheet.create({
	trackListCheck: {
		width: 32
	},
	trackListNumber: {
		flex: 1,
		paddingRight: staticTheme.paddingSmall,
		fontSize: staticTheme.fontSizeSmall
	},
	trackListTitle: {
		flex: 7
	},
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
	setSelected?: (item: TrackEntry) => void;
	doubleTab?: (item: TrackEntry) => void;
}> = React.memo(({track, displayFunc, isSelected, setSelected, doubleTab}) => {
	const theme = useTheme();
	const doubleTap = React.useRef(React.createRef<TapGestureHandler>().current);
	const display = displayFunc ? displayFunc(track) : defaultTrackDisplay(track);

	const setItemSelected = (): void => {
		if (setSelected) {
			setSelected(track);
		}
	};

	const onDoubleTapped = useCallback((event: TapGestureHandlerStateChangeEvent): void => {
		if (event.nativeEvent.state === State.ACTIVE && doubleTab) {
			doubleTab(track);
		}
	}, [track, doubleTab]);

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

	return (
		<TouchableNativeFeedback onPress={setItemSelected}>
			<View style={sharedStyles.item}>
				<View style={styles.trackListCheck}>
					<CheckBox
						value={isSelected}
						tintColors={{'true': theme.checkbox.checked, 'false': theme.checkbox.unchecked}}
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
