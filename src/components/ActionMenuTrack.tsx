import React from 'react';
import {TrackEntry} from '../services/types';
import {StyleSheet} from 'react-native';
import {JamPlayer} from '../services/player';
import {NavigationService} from '../navigators/navigation';
import {JamObjectType} from '../services/jam';
import {ThemedIcon} from './ThemedIcon';

const styles = StyleSheet.create({
	playButton: {
		color: '#ffffff'
	}
});

export const executeTrackMenuAction = async (selection: Array<TrackEntry>, name?: string): Promise<boolean> => {
	if (selection.length > 0) {
		if (name === 'bt_m_play') {
			await JamPlayer.playTracks(selection);
			return true;
		} else if (name === 'bt_m_queue') {
			await JamPlayer.addTracksToQueue(selection);
			return true;
		} else if (name === 'bt_s_play') {
			await JamPlayer.playTrack(selection[0]);
			return true;
		} else if (name === 'bt_s_queue') {
			await JamPlayer.addTrackToQueue(selection[0]);
			return true;
		} else if (name === 'bt_s_open') {
			NavigationService.navigateObj(JamObjectType.track, selection[0].id, selection[0].title);
		}
	}
	return false;
};

export const trackMenuIcon = <ThemedIcon name={'menu'} color={styles.playButton.color}/>;

export const trackMenuMultiSelectActions = [
	{
		text: 'Add to Queue',
		icon: <ThemedIcon name={'list-add'} color={styles.playButton.color}/>,
		name: 'bt_m_queue',
		position: 1
	},
	{
		text: 'Play',
		icon: <ThemedIcon name={'play'} color={styles.playButton.color}/>,
		name: 'bt_m_play',
		position: 2
	}
];

export const trackMenuSingleSelectActions = [
	{
		text: 'Open Profile',
		icon: <ThemedIcon name={'track'} color={styles.playButton.color}/>,
		name: 'bt_s_open',
		position: 1
	},
	{
		text: 'Add to Queue',
		icon: <ThemedIcon name={'list-add'} color={styles.playButton.color}/>,
		name: 'bt_s_queue',
		position: 2
	},
	{
		text: 'Play',
		icon: <ThemedIcon name={'play'} color={styles.playButton.color}/>,
		name: 'bt_s_play',
		position: 3
	}
];
