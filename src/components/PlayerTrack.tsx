import {StyleSheet, View} from 'react-native';
import React from 'react';
import {ThemedText} from './ThemedText';
import {staticTheme} from '../style/theming';
import {useTrackPlayerCurrentTrack} from 'react-native-track-player';

const styles = StyleSheet.create({
	card: {
		padding: staticTheme.padding,
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		textAlign: 'center'
	},
	artist: {
		textAlign: 'center'
	}
});

export const PlayerTrack: React.FC = () => {
	const currentTrack = useTrackPlayerCurrentTrack() || {artwork: undefined, title: undefined, artist: undefined};
	return (
		<View style={styles.card}>
			<ThemedText style={styles.title}>{currentTrack.title}</ThemedText>
			<ThemedText style={styles.artist}>{currentTrack.artist}</ThemedText>
		</View>
	);
};
