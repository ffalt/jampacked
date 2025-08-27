import React from 'react';
import { StyleSheet, View } from 'react-native';
import { JamPlayer } from '../services/player.service.ts';
import { PlayButton } from './PlayButton';
import { staticTheme } from '../style/theming';
import { ClickIcon } from './ClickIcon';
import { useTrackPlayerHasSiblings } from '../services/player.api.ts';

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
	const { hasNext, hasPrevious } = useTrackPlayerHasSiblings();
	return (
		<View style={styles.playerControl}>
			<ClickIcon
				disabled={!hasNext}
				fontSize={staticTheme.fontSizeLarge}
				style={[styles.button, !hasNext && styles.disabled]}
				iconName="step-backward"
				onPress={() => JamPlayer.skipToPreviousSync()} />
			<ClickIcon
				fontSize={staticTheme.fontSizeLarge}
				style={styles.button}
				iconName="backward"
				onPress={() => JamPlayer.skipBackwardSync()}
			/>
			<PlayButton />
			<ClickIcon
				fontSize={staticTheme.fontSizeLarge}
				style={styles.button}
				iconName="forward"
				onPress={() => JamPlayer.skipForwardSync()}
			/>
			<ClickIcon
				disabled={!hasPrevious}
				fontSize={staticTheme.fontSizeLarge}
				style={[styles.button, !hasPrevious && styles.disabled]}
				iconName="step-forward"
				onPress={() => JamPlayer.skipToNextSync()} />
		</View>
	);
};
