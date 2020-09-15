import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from './ThemedIcon';
import {PlayButton} from './PlayButton';
import {staticTheme} from '../style/theming';

const styles = StyleSheet.create({
	playerControl: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 8
	},
	disabled: {
		opacity: 0.3
	},
	button: {
		height: 50,
		width: 50,
		borderWidth: 1,
		borderRadius: 50 / 2,
		borderColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export const PlayerControl: React.FC = () => {
	const forwardDisabled = false;
	return (
		<View style={styles.playerControl}>
			<TouchableOpacity onPress={JamPlayer.skipToPrevious} style={styles.button}>
				<ThemedIcon name="step-backward" size={staticTheme.fontSizeLarge}/>
			</TouchableOpacity>
			<TouchableOpacity onPress={JamPlayer.skipBackward} style={styles.button}>
				<ThemedIcon name="backward" size={staticTheme.fontSizeLarge}/>
			</TouchableOpacity>
			<PlayButton/>
			<TouchableOpacity disabled={forwardDisabled} onPress={JamPlayer.skipForward} style={[styles.button,forwardDisabled && styles.disabled]}>
				<ThemedIcon name="forward" size={staticTheme.fontSizeLarge}/>
			</TouchableOpacity>
			<TouchableOpacity onPress={JamPlayer.skipToNext} style={styles.button}>
				<ThemedIcon name="step-forward" size={staticTheme.fontSizeLarge}/>
			</TouchableOpacity>
		</View>
	);
};
