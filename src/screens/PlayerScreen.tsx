import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {PlayerProgress} from '../components/PlayerProgress';
import {PlayerTime} from '../components/PlayerTime';
import {PlayerControl} from '../components/PlayerControl';
import {PlayerTabs} from '../components/PlayerTabs';
import {staticTheme} from '../style/theming';
import {PlayerTrack} from '../components/PlayerTrack';
import {ModalRouting, ModalStackProps} from '../navigators/Routing';
import {PlayerWaveformProgress} from '../components/PlayerWaveformProgress';
import { PlayerAnnotation } from '../components/PlayerAnnotation';

const styles = StyleSheet.create({
	player: {
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? staticTheme.paddingLarge : 0,
		paddingBottom: Platform.OS === 'ios' ? staticTheme.paddingLarge * 2 : staticTheme.paddingLarge
	}
});

export const PlayerScreen: React.FC<ModalStackProps<ModalRouting.PLAYER>> = () => {
	return (
		<View style={styles.player}>
			<PlayerTabs/>
			<PlayerTrack/>
			<PlayerWaveformProgress/>
			<PlayerProgress/>
			<PlayerTime/>
			<PlayerAnnotation/>
			<PlayerControl/>
		</View>
	);
};
