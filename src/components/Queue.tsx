import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {JamPlayer, useCurrentTrackIndex, useQueue} from '../services/player';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {ThemedIcon} from './ThemedIcon';
import {QueueItem} from './QueueItem';
import {DefaultFlatList} from './DefFlatList';
import {TrackPlayerTrack} from '../services/player-api';

const styles = StyleSheet.create({
	queueButtons: {
		borderBottomWidth: 1,
		borderTopWidth: 1,
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	queueButton: {
		flex: 1,
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 32
	},
	queueButtonText: {
		paddingHorizontal: staticTheme.paddingSmall
	}
});


export const Queue: React.FC = () => {
	const queue = useQueue();
	const theme = useTheme();
	const current = useCurrentTrackIndex();

	const renderItem = useCallback(({item, index}: { item: TrackPlayerTrack, index: number }): JSX.Element => (
		<QueueItem item={item} index={index} active={index === current}/>
	), [current]);
	const reload = useCallback(() => {
		 
	}, []);

	const keyExtractor = useCallback((item: TrackPlayerTrack, index: number): string => `${index}:${item.id}`, []);

	return (
		<>
			<DefaultFlatList
				items={queue}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				loading={false}
				reload={reload}
			/>
			<View style={[styles.queueButtons, {borderColor: theme.separator}]}>
				<TouchableOpacity style={styles.queueButton} onPress={JamPlayer.clearQueue}>
					<ThemedIcon name="trash"/>
					<ThemedText style={styles.queueButtonText}>Clear</ThemedText>
				</TouchableOpacity>
				<TouchableOpacity style={styles.queueButton} onPress={JamPlayer.shuffleQueue}>
					<ThemedIcon name="shuffle"/>
					<ThemedText style={styles.queueButtonText}>Shuffle</ThemedText>
				</TouchableOpacity>
			</View>
		</>
	);
};
