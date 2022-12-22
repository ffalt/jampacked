import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {JamPlayer, useCurrentTrack} from '../services/player';
import {JamImage} from './JamImage';
import {ThemedText} from './ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {PlayButton} from './PlayButton';
import {ModalRouting} from '../navigators/Routing';
import {MiniProgressBar} from './PlayerProgressMini';
import {NavigationService} from '../navigators/navigation';

const styles = StyleSheet.create({
	disabled: {
		opacity: 0.3
	},
	playerStrip: {
		borderTopWidth: 1
	},
	playerStripTrack: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	playerStripContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 64,
		paddingLeft: staticTheme.paddingLarge,
		paddingRight: staticTheme.paddingLarge
	},
	playerStripText: {
		flex: 1,
		paddingLeft: staticTheme.paddingLarge,
		paddingRight: staticTheme.paddingLarge
	},
	playerStripImage: {
		alignItems: 'center',
		width: 46
	},
	playerStripControls: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontSize: staticTheme.fontSize
	},
	artist: {
		fontSize: staticTheme.fontSizeSmall
	},
	button: {
		height: 50,
		width: 40,
		borderWidth: 1,
		borderRadius: 50 / 2,
		borderColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export const PlayerStrip: React.FC = () => {
	const track = useCurrentTrack();
	const theme = useTheme();
	if (!track) {
		return (<></>);
	}
	const forwardDisabled = false;
	const showPlayer = (): void => {
		NavigationService.navigate(ModalRouting.PLAYER);
	};
	return (
		<View style={[styles.playerStrip, {borderTopColor: theme.separator, backgroundColor: theme.control}]}>
			<View style={styles.playerStripContent}>
				<TouchableOpacity onPress={showPlayer} style={styles.playerStripTrack}>
					<View style={styles.playerStripImage}>
						<JamImage id={track.id} size={staticTheme.thumb}/>
					</View>
					<View style={styles.playerStripText}>
						<ThemedText numberOfLines={1} style={styles.title}>{track.title}</ThemedText>
						<ThemedText numberOfLines={1} style={styles.artist}>{track.artist}</ThemedText>
					</View>
				</TouchableOpacity>
				<View style={styles.playerStripControls}>
					<TouchableOpacity onPress={JamPlayer.skipBackward} style={styles.button}>
						<ThemedIcon name="backward"/>
					</TouchableOpacity>
					<PlayButton/>
					<TouchableOpacity disabled={forwardDisabled} onPress={JamPlayer.skipForward} style={[styles.button, forwardDisabled && styles.disabled]}>
						<ThemedIcon name="forward"/>
					</TouchableOpacity>
				</View>
			</View>
			<MiniProgressBar/>
		</View>
	);
};

