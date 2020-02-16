import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {TrackPlayer} from '../services/player-api';
import {JamPlayer, useCurrentTrackID, useQueue} from '../services/player';
import {staticTheme, useTheme} from '../style/theming';
import DurationText from './DurationText';
import ThemedText from './ThemedText';
import {commonItemLayout} from './AtoZList';
import Separator from './Separator';
import ThemedIcon from './ThemedIcon';
import {snackError} from '../services/snack';
import SwipeableListItem from './SwipeItem';

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
	},
	queueButtons: {
		borderTopWidth: 2,
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	queueButton: {
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		flexDirection: 'row',
		alignItems: 'center',
		height: 32
	},
	queueButtonIcon: {
		paddingRight: staticTheme.paddingSmall
	}
});

function QueueItem(props: {
	active: boolean;
	index: number;
	item: TrackPlayer.Track;
}): JSX.Element {
	const playItem = (): void => {
		const {item} = props;
		JamPlayer.skipToTrack(item.id)
			.catch(e => console.error(e));
	};
	const {index, active, item} = props;
	const theme = useTheme();

	const renderTrackNr = (): JSX.Element => {
		if (active) {
			return (<ThemedIcon name="play"/>);
		}
		return (<ThemedText style={styles.trackNumberStyle}>{index + 1}</ThemedText>);
	};

	const right = (): JSX.Element => {
		return (<ThemedIcon name="remove"/>);
	};

	const rightPress = (): void => {
		JamPlayer.removeTrackFromQueue(item.id)
			.catch(e => console.error(e));
	};

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
					<DurationText style={styles.trackRuntimeStyle} duration={item.duration}/>
				</View>
			</TouchableOpacity>
		</SwipeableListItem>

	);
}

export default function Queue(): JSX.Element {
	const queue = useQueue();
	const theme = useTheme();
	const current = useCurrentTrackID();

	const renderQueueItem = ({item, index}: { item: TrackPlayer.Track, index: number }): JSX.Element => (
		<QueueItem item={item} index={index} active={item.id === current}/>
	);

	const keyExtractor = (item: TrackPlayer.Track): string => item.id;

	const getItemLayout = commonItemLayout(56);

	const clearQueue = (): void => {
		JamPlayer.clearQueue()
			.catch(e => {
				snackError(e);
			});
	};

	const renderFooter = (): JSX.Element => {
		return (
			<View style={[styles.queueButtons, {borderColor: theme.separator}]}>
				<TouchableOpacity style={styles.queueButton} onPress={clearQueue}>
					<ThemedIcon style={styles.queueButtonIcon} name="trash"/>
					<ThemedText>Clear</ThemedText>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<>
			<FlatList
				data={queue}
				renderItem={renderQueueItem}
				ItemSeparatorComponent={Separator}
				keyExtractor={keyExtractor}
				getItemLayout={getItemLayout}
			/>
			{renderFooter()}
		</>
	);
}
