import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {JamPlayer, usePlaybackStateIsPlaying} from '../services/player';
import ThemedIcon from './ThemedIcon';

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
		fontSize: 20
	}
});

const PlayButton: React.FC = () => {
	const isPlaying = usePlaybackStateIsPlaying();
	const icon = isPlaying ? 'pause' : 'play';
	const toggle = (): void => {
		JamPlayer.toggle()
			.catch(e => console.error(e));
	};
	return (
		<TouchableOpacity onPress={toggle}>
			<View style={styles.playButton}>
				<ThemedIcon name={icon} style={[styles.playButtonIcon]}/>
			</View>
		</TouchableOpacity>
	);
};

export default PlayButton;
