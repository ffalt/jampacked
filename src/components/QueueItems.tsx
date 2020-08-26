import React, {useCallback} from 'react';
import {TrackPlayer} from '../services/player-api';
import {staticTheme, useTheme} from '../style/theming';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from './ThemedIcon';
import {ThemedText} from './ThemedText';
import {SwipeableListItem} from './SwipeItem';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {DurationText} from './DurationText';

const styles = StyleSheet.create({
	trackListContainer: {
		paddingHorizontal: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center'
	},
	trackListNumber: {
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		width: 50
	},
	trackListTitle: {
		flex: 5
	},
	trackListRuntime: {
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
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

export const QueueItem: React.FC<{ active: boolean; index: number; item: TrackPlayer.Track; }> = React.memo(({index, active, item}) => {
	const theme = useTheme();

	const playItem = useCallback((): void => {
		JamPlayer.skipToTrack(item.id)
			.catch(e => console.error(e));
	}, [item]);

	const renderTrackNr = useCallback((): JSX.Element => {
		if (active) {
			return (<ThemedIcon name="play"/>);
		}
		return (<ThemedText style={styles.trackNumberStyle}>{index + 1}</ThemedText>);
	}, [active, index]);

	const right = useCallback((): JSX.Element => {
		return (<ThemedIcon name="remove"/>);
	}, []);

	const rightPress = useCallback((): void => {
		JamPlayer.removeTrackFromQueue(item.id)
			.catch(e => console.error(e));
	}, [item]);

	return (
		<SwipeableListItem
			height={56}
			right={right}
			leftWidth={0}
			rightWidth={64}
			onPressRight={rightPress}
		>
			<TouchableOpacity onPress={playItem} style={[styles.trackListContainer, {backgroundColor: theme.background}]}>
				<View style={styles.trackListNumber}>
					{renderTrackNr()}
				</View>
				<View style={styles.trackListTitle}>
					<ThemedText style={styles.trackTitleStyle}>{item.title}</ThemedText>
				</View>
				<View style={styles.trackListRuntime}>
					<DurationText style={styles.trackRuntimeStyle} duration={item.duration} ms={true}/>
				</View>
			</TouchableOpacity>
		</SwipeableListItem>
	);
});
