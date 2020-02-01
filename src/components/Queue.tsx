import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {TrackPlayer} from '../services/player-api';
import {JamPlayer, useCurrentTrackID, useQueue} from '../services/player';
import {staticTheme, useTheme} from '../style/theming';
import DurationText from './DurationText';
import ThemedText from './ThemedText';
import {commonItemLayout} from './AtoZList';
import Separator from './Separator';

const styles = StyleSheet.create({
	trackListContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 42
	},
	trackListNumber: {
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		flex: 1
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

function QueueItem(props: {
	active: boolean;
	index: number;
	item: TrackPlayer.Track;
}): JSX.Element {
	const theme = useTheme();
	const playItem = (): void => {
		JamPlayer.skipToTrack(props.item.id);
	};
	return (
		<TouchableOpacity onPress={playItem} style={[styles.trackListContainer, props.active && {backgroundColor: theme.activeBackgroundColor}]}>
			<View style={styles.trackListNumber}>
				<ThemedText style={styles.trackNumberStyle}>{props.index + 1}</ThemedText>
			</View>
			<View style={styles.trackListTitle}>
				<ThemedText style={styles.trackTitleStyle}>{props.item.title}</ThemedText>
			</View>
			<View style={styles.trackListRuntime}>
				<DurationText style={styles.trackRuntimeStyle} duration={props.item.duration}/>
			</View>
		</TouchableOpacity>
	);
}

export default function Queue(): JSX.Element {
	const queue = useQueue();
	const current = useCurrentTrackID();

	const renderQueueItem = ({item, index}: { item: TrackPlayer.Track, index: number }): JSX.Element => (
		<QueueItem item={item} index={index} active={item.id === current}/>
	);

	const keyExtractor = (item: TrackPlayer.Track): string => item.id;

	const getItemLayout = commonItemLayout(43);

	return (
		<FlatList
			data={queue}
			renderItem={renderQueueItem}
			ItemSeparatorComponent={Separator}
			keyExtractor={keyExtractor}
			getItemLayout={getItemLayout}
		/>
	);
}
