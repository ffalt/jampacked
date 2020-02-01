import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import PlayerProgress, {PlayerWaveFormProgress} from '../components/PlayerProgress';
import PlayerTime from '../components/PlayerTime';
import PlayerControl from '../components/PlayerControl';
import PlayerTabs from '../components/PlayerTabs';
import {staticTheme} from '../style/theming';
import PlayerTrack from '../components/PlayerTrack';

const styles = StyleSheet.create({
	player: {
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? staticTheme.paddingLarge : 0,
		paddingBottom: Platform.OS === 'ios' ? staticTheme.paddingLarge * 2 : staticTheme.paddingLarge
	}
});

const PlayerScreen: React.FC = () => (
	<View style={styles.player}>
		<PlayerTabs/>
		<PlayerTrack/>
		<PlayerWaveFormProgress/>
		<PlayerProgress/>
		<PlayerTime/>
		<PlayerControl/>
	</View>
);

export default PlayerScreen;
