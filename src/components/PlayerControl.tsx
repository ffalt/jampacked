import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {JamPlayer} from '../services/player';
import ThemedIcon from './ThemedIcon';
import PlayButton from './PlayButton';

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

export default class PlayerControl extends React.PureComponent {
	render(): React.ReactElement {
		const forwardDisabled = false;
		return (
			<View style={styles.playerControl}>
				<TouchableOpacity onPress={JamPlayer.skipToPrevious} style={styles.button}>
					<ThemedIcon name="step-backward"/>
				</TouchableOpacity>
				<TouchableOpacity onPress={JamPlayer.skipBackward} style={styles.button}>
					<ThemedIcon name="backward"/>
				</TouchableOpacity>
				<PlayButton/>
				<TouchableOpacity disabled={forwardDisabled} onPress={JamPlayer.skipForward} style={styles.button}>
					<ThemedIcon name="forward" style={forwardDisabled && styles.disabled}/>
				</TouchableOpacity>
				<TouchableOpacity onPress={JamPlayer.skipToNext} style={styles.button}>
					<ThemedIcon name="step-forward"/>
				</TouchableOpacity>
			</View>
		);
	}
}
