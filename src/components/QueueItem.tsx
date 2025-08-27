import React, { useCallback } from 'react';
import { TrackPlayerTrack } from '../services/player.api.ts';
import { staticTheme, useTheme } from '../style/theming';
import { JamPlayer } from '../services/player.service.ts';
import { ThemedIcon } from './ThemedIcon';
import { ThemedText } from './ThemedText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DurationText } from './DurationText';
import { PinIcon } from './PinIcon';
import { FavIcon } from './FavIcon';
import { ClickIcon } from './ClickIcon';
import { SwipeableItem } from './SwipeableItem';
import { sharedStyles } from '../style/shared';
import { JamObjectType } from '../services/jam';

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

export const QueueItem: React.FC<{ active: boolean; index: number; item: TrackPlayerTrack }> = React.memo(({ index, active, item }) => {
	const theme = useTheme();

	const playItem = useCallback((): void => {
		JamPlayer.skipToTrack(index)
			.catch(console.error);
	}, [index]);

	const renderTrackNr = useCallback((): React.JSX.Element => {
		if (active) {
			return (<ThemedIcon name="right-open-mini" />);
		}
		return (<ThemedText style={styles.trackNumberStyle}>{index + 1}</ThemedText>);
	}, [active, index]);

	const rightPress = useCallback((): void => {
		JamPlayer.removeTrackFromQueue(index)
			.catch(console.error);
	}, [index]);

	const buttons = (
		<>
			<PinIcon style={sharedStyles.itemButton} fontSize={sharedStyles.itemButtonIcon.fontSize} objType={JamObjectType.track} id={item.id} />
			<FavIcon style={sharedStyles.itemButton} fontSize={sharedStyles.itemButtonIcon.fontSize} objType={JamObjectType.track} id={item.id} />
			<ClickIcon style={sharedStyles.itemButton} fontSize={sharedStyles.itemButtonIcon.fontSize} iconName="remove" onPress={rightPress} clickThrough={true} />
		</>
	);

	return (
		<SwipeableItem buttons={buttons}>
			<TouchableOpacity onPress={playItem} style={[styles.trackListContainer, { height: sharedStyles.item.height, backgroundColor: theme.background }]}>
				<View style={styles.trackListNumber}>
					{renderTrackNr()}
				</View>
				<View style={styles.trackListTitle}>
					<ThemedText style={styles.trackTitleStyle}>{item.title}</ThemedText>
					<ThemedText style={styles.trackSubStyle}>{item.artist}</ThemedText>
				</View>
				<View style={styles.trackListRuntime}>
					<DurationText style={styles.trackRuntimeStyle} duration={item.duration} ms={true} />
				</View>
			</TouchableOpacity>
		</SwipeableItem>
	);
});
