import React from 'react';
import {TrackEntry} from '../services/types';
import {StyleSheet} from 'react-native';
import {JamPlayer} from '../services/player';
import {NavigationService} from '../navigators/navigation';
import {JamObjectType} from '../services/jam';
import {ThemedIcon} from './ThemedIcon';
import {IActionProps} from 'react-native-floating-action';

export interface ActionMenuIten extends IActionProps {
	position?: number;
}

export const executeTrackMenuAction = async (selection: Array<TrackEntry>, name?: string): Promise<boolean> => {
	if (selection.length > 0) {
		if (name === 'bt_clear') {
			return true;
		} else if (name === 'bt_m_play') {
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

export const trackMenuIcon: (color: string) => JSX.Element = (color) => {
	return <ThemedIcon name={'menu'} color={color}/>;
};

export const trackMenuMultiSelectActions: (color: string, iconColor: string) => Array<ActionMenuIten> = (color, iconColor) => {
	return [
		{
			text: 'Clear Selection',
			color,
			icon: <ThemedIcon name={'minus'} color={iconColor}/>,
			name: 'bt_clear',
			position: 1
		},
		{
			text: 'Add to Queue',
			color,
			icon: <ThemedIcon name={'list-add'} color={iconColor}/>,
			name: 'bt_m_queue',
			position: 2
		},
		{
			text: 'Play',
			color,
			icon: <ThemedIcon name={'play'} color={iconColor}/>,
			name: 'bt_m_play',
			position: 3
		}
	];
};

export const trackMenuSingleSelectActions: (color: string, iconColor: string) => Array<ActionMenuIten> = (color, iconColor) => {
	return [
		{
			text: 'Open Profile',
			color,
			icon: <ThemedIcon name={'track'} color={iconColor}/>,
			name: 'bt_s_open',
			position: 1
		},
		{
			text: 'Add to Queue',
			color,
			icon: <ThemedIcon name={'list-add'} color={iconColor}/>,
			name: 'bt_s_queue',
			position: 2
		},
		{
			text: 'Play',
			color,
			icon: <ThemedIcon name={'play'} color={iconColor}/>,
			name: 'bt_s_play',
			position: 3
		}
	];
};
