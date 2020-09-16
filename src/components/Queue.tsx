import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {TrackPlayer} from '../services/player-api';
import {JamPlayer, useCurrentTrackID, useQueue} from '../services/player';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {Separator} from './Separator';
import {ThemedIcon} from './ThemedIcon';
import {QueueItem} from './QueueItems';
import {commonItemLayout, defaultItemLayout, defaultKeyExtractor} from '../utils/list.utils';

const styles = StyleSheet.create({
	queueButtons: {
		borderBottomWidth: 1,
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

	const renderItem = useCallback(({item, index}: { item: TrackPlayer.Track, index: number }): JSX.Element => (
		<QueueItem item={item} index={index} active={item.id === current}/>
	), [current]);

	return (
		<>
			<FlatList
				data={queue}
				renderItem={renderItem}
				ItemSeparatorComponent={Separator}
				keyExtractor={defaultKeyExtractor}
				getItemLayout={defaultItemLayout}
			/>
			<View style={[styles.queueButtons, {borderColor: theme.separator}]}>
				<TouchableOpacity style={styles.queueButton} onPress={JamPlayer.clearQueue}>
					<ThemedIcon name="trash"/>
					<ThemedText style={styles.queueButtonText}>Clear</ThemedText>
				</TouchableOpacity>
			</View>
		</>
	);
};
