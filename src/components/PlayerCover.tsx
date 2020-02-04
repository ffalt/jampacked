import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useCurrentTrackID} from '../services/player';
import JamImage from './JamImage';

const styles = StyleSheet.create({
	cover: {
		flex: 1,
		width: '100%',
		padding: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		borderRadius: 4
	}
});

const PlayerCover: React.FC = () => {
	const id = useCurrentTrackID();
	if (!id) {
		return <></>;
	}
	return (
		<View style={styles.cover}>
			<JamImage id={id} size={300} requestSize={300} style={styles.image}/>
		</View>
	);
};

export default PlayerCover;
