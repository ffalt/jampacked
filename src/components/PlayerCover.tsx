import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useCurrentTrackID } from '../services/player';
import { useTheme } from '../style/theming';
import { JamImage } from './JamImage';

const styles = StyleSheet.create({
	cover: {
		flex: 1,
		width: '100%',
		padding: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		borderRadius: 4,
		padding: 0,
		height: '100%',
		width: '100%'
	}
});

export const PlayerCover: React.FC = () => {
	const id = useCurrentTrackID();
	const theme = useTheme();
	if (!id) {
		return <></>;
	}
	return (
		<View style={[styles.cover, { borderColor: theme.separator }]}>
			<JamImage id={id} requestSize={600} style={styles.image} />
		</View>
	);
};
