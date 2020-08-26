import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {TrackPlayer} from '../services/player-api';
import {JamPlayer, useCurrentTrackID, useQueue} from '../services/player';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {commonItemLayout} from './AtoZList';
import {Separator} from './Separator';
import {ThemedIcon} from './ThemedIcon';
import {QueueItem} from './QueueItems';

const styles = StyleSheet.create({
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
	queueButtonText: {
		paddingLeft: staticTheme.paddingSmall
	}
});


export const Queue: React.FC = () => {
	const queue = useQueue();
	const theme = useTheme();
	const current = useCurrentTrackID();

	const renderQueueItem = useCallback(({item, index}: { item: TrackPlayer.Track, index: number }): JSX.Element => (
		<QueueItem item={item} index={index} active={item.id === current}/>
	), [current]);

	const keyExtractor = (item: TrackPlayer.Track): string => item.id;

	const getItemLayout = React.useMemo(() => commonItemLayout(56), []);

	return (
		<View>
			<FlatList
				data={queue}
				renderItem={renderQueueItem}
				ItemSeparatorComponent={Separator}
				keyExtractor={keyExtractor}
				getItemLayout={getItemLayout}
			/>
			<View style={[styles.queueButtons, {borderColor: theme.separator}]}>
				<TouchableOpacity style={styles.queueButton} onPress={JamPlayer.clearQueue}>
					<ThemedIcon name="trash"/>
					<ThemedText style={styles.queueButtonText}>Clear</ThemedText>
				</TouchableOpacity>
			</View>
		</View>
	);
};
