import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useCurrentTrack} from '../services/player';
import ThemedText from './ThemedText';
import {staticTheme} from '../style/theming';

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

const PlayerTrack: React.FC = () => {
	const currentTrack = useCurrentTrack() || {artwork: undefined, title: undefined, artist: undefined};
	return (
		<View style={styles.card}>
			<ThemedText style={styles.title}>{currentTrack.title}</ThemedText>
			<ThemedText style={styles.artist}>{currentTrack.artist}</ThemedText>
		</View>
	);
};

export default PlayerTrack;
