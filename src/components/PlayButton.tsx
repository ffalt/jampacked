import React from 'react';
import { StyleSheet } from 'react-native';
import { JamPlayer } from '../services/player';
import { useTrackPlayerPlaybackStateIsPlaying } from '../services/player-api';
import { ClickIcon } from './ClickIcon';

const styles = StyleSheet.create({
	playButton: {
		height: 50,
		width: 50,
		borderWidth: 1,
		backgroundColor: '#e2e2e2',
		borderRadius: 50 / 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	// eslint-disable-next-line react-native/no-unused-styles
	playButtonIcon: {
		color: '#000000',
		fontSize: 20,
		textAlign: 'center'
	}
});

export const PlayButton: React.FC = () => {
	const isPlaying = useTrackPlayerPlaybackStateIsPlaying();
	const icon = isPlaying ? 'pause' : 'play';
	return (
		<ClickIcon
			iconName={icon}
			onPress={() => JamPlayer.toggleSync()}
			style={styles.playButton}
			color={styles.playButtonIcon.color}
			fontSize={styles.playButtonIcon.fontSize}
		/>
	);
};
