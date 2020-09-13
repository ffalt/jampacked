import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useCurrentTrackID} from '../services/player';
import {JamImage} from './JamImage';
import {staticTheme, useTheme} from '../style/theming';

const styles = StyleSheet.create({
	cover: {
		flex: 1,
		width: '100%',
		padding: 0,
		alignItems: 'center',
		borderBottomWidth: 1,
		justifyContent: 'center'
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
			<JamImage id={id} size={staticTheme.cover} requestSize={staticTheme.cover} style={styles.image}/>
		</View>
	);
};
