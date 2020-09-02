import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useCurrentTrackID} from '../services/player';
import {JamImage} from './JamImage';
import {useTheme} from '../style/theming';

const styles = StyleSheet.create({
	cover: {
		flex: 1,
		width: '100%',
		padding: 0,
		alignItems: 'center',
		borderBottomWidth: 1,
		justifyContent: 'center',
		marginBottom: 32
	},
	image: {
		borderRadius: 4
	}
});

export const PlayerCover: React.FC = () => {
	const id = useCurrentTrackID();
	const theme = useTheme();
	if (!id) {
		return <></>;
	}
	return (
		<View style={[styles.cover, {borderColor: theme.separator}]}>
			<JamImage id={id} size={300} requestSize={300} style={styles.image}/>
		</View>
	);
};
