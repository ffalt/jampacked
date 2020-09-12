import React, {useEffect, useState} from 'react';
import {TrackEntry} from '../services/types';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedText} from './ThemedText';
import {JamPlayer} from '../services/player';
import {NavigationService} from '../services/navigation';
import {JamObjectType} from '../services/jam';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		padding: 12
	},
	item: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50
	}
});

type ClickFunc = () => void;

export const ActionSheetEpisode: React.FC<{ item?: TrackEntry }> = ({item}) => {
	const [actions, setActions] = useState<Array<{ title: string; click: ClickFunc }>>([]);

	useEffect(() => {
		if (!item) {
			setActions([]);
			return;
		}
		setActions([
			{
				title: 'Play Episode',
				click: (): void => {
					JamPlayer.playTrack(item)
						.catch(e => console.error(e));
				}
			},
			{
				title: 'Add Episode to Queue',
				click: (): void => {
					JamPlayer.addTrackToQueue(item)
						.catch(e => console.error(e));
				}
			},
			// {
			// 	title: 'Add Episodes from here to Queue',
			// 	click: (): void => {
			// 		const tracks = podcast?.episodes || [];
			// 		const index = tracks.indexOf(item);
			// 		if (index >= 0) {
			// 			JamPlayer.addTracksToQueue(tracks.slice(index))
			// 				.catch(e => console.error(e));
			// 		}
			// 	}
			// },
			{
				title: 'Open Episode Profile',
				click: (): void => {
					NavigationService.navigateObj(JamObjectType.episode, item.id, item.title);
				}
			}
		]);
	}, [item]);

	return (
		<ScrollView
			nestedScrollEnabled={false}
			scrollEnabled={false}
			style={styles.container}>
			<>
				{actions.map(action => (
					<TouchableOpacity
						key={action.title}
						onPress={action.click}
						style={styles.item}>
						<ThemedText>{action.title}</ThemedText>
					</TouchableOpacity>
				))}
			</>
		</ScrollView>
	);
};
