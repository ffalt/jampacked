import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from './ThemedIcon';
import {useTrackPlayerPlaybackStateIsPlaying} from 'react-native-track-player';

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
		<TouchableOpacity onPress={JamPlayer.toggle}>
			<View style={styles.playButton}>
				<ThemedIcon name={icon} size={styles.playButtonIcon.fontSize} color={styles.playButtonIcon.color}/>
			</View>
		</TouchableOpacity>
	);
};
