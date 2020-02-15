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

const styles = StyleSheet.create({
	trackListContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 56
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

function QueueItem(props: {
	active: boolean;
	index: number;
	item: TrackPlayer.Track;
}): JSX.Element {
	const playItem = (): void => {
		JamPlayer.skipToTrack(props.item.id);
	};
	const {index, active, item} = props;

	const renderTrackNr = (): JSX.Element => {
		if (active) {
			return (<ThemedIcon name="play"/>);
		}
		return (<ThemedText style={styles.trackNumberStyle}>{index + 1}</ThemedText>);
	};
	return (
		<TouchableOpacity onPress={playItem} style={styles.trackListContainer}>
			<View style={styles.trackListNumber}>
				{renderTrackNr()}
			</View>
			<View style={styles.trackListTitle}>
				<ThemedText style={styles.trackTitleStyle}>{item.title}</ThemedText>
				<ThemedText style={styles.trackSubStyle}>{item.artist} - {item.album}</ThemedText>
			</View>
			<View style={styles.trackListRuntime}>
				<DurationText style={styles.trackRuntimeStyle} duration={item.duration}/>
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

	const getItemLayout = commonItemLayout(56);

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
