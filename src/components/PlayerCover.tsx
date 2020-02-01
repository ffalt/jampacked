import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {useCurrentTrack} from '../services/player';

const styles = StyleSheet.create({
	cover: {
		flex: 1,
		width: '100%',
		padding: 0
	}
});

const PlayerCover: React.FC = () => {
	const currentTrack = useCurrentTrack() || {artwork: undefined, title: undefined, artist: undefined};
	const source = {
		uri: currentTrack.artwork,
		// headers: { Authorization: 'someAuthToken' },
		priority: FastImage.priority.normal
	};
	return (
		<View style={styles.cover}>
			<FastImage
				style={StyleSheet.absoluteFill}
				source={source}
				resizeMode={FastImage.resizeMode.contain}
			/>
		</View>
	);
};

export default PlayerCover;
