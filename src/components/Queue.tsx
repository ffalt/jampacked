import { View } from 'react-native';
import React, { useCallback } from 'react';
import { JamPlayer } from '../services/player';
import { useTheme } from '../style/theming';
import { QueueItem } from './QueueItem';
import { DefaultFlatList } from './DefaultFlatList.tsx';
import { TrackPlayerTrack, useTrackPlayerCurrentTrackNr, useTrackPlayerQueue } from '../services/player-api';
import { ClickLabelIcon } from './ClickLabelIcon';
import { sharedStyles } from '../style/shared';

export const Queue: React.FC = () => {
	const queue = useTrackPlayerQueue();
	const theme = useTheme();
	const current = useTrackPlayerCurrentTrackNr();

	const renderItem = useCallback(({ item, index }: { item: TrackPlayerTrack; index: number }): React.JSX.Element => (
		<QueueItem item={item} index={index} active={index === current} />
	), [current]);
	const reload = useCallback(() => {
		// nop
	}, []);

	const keyExtractor = useCallback((item: TrackPlayerTrack, index: number): string => `${index}:${item.id}`, []);

	return (
		<DefaultFlatList
			items={queue}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			ListHeaderComponent={(
				<View style={[sharedStyles.barButtons, { borderColor: theme.separator }]}>
					<ClickLabelIcon
						iconName="trash"
						onPress={() => JamPlayer.clearQueueSync()}
						label="Clear"
						style={sharedStyles.barButton}
						labelStyle={sharedStyles.barButtonText}
					/>
					<ClickLabelIcon
						iconName="shuffle"
						onPress={() => JamPlayer.shuffleQueueSync()}
						label="Shuffle"
						style={sharedStyles.barButton}
						labelStyle={sharedStyles.barButtonText}
					/>
				</View>
			)}
			loading={false}
			reload={reload}
		/>
	);
};
