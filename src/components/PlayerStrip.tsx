import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {JamPlayer} from '../services/player';
import {useTrackPlayerCurrentTrack, useTrackPlayerHasSiblings} from '../services/player-api';
import {JamImage} from './JamImage';
import {ThemedText} from './ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import {PlayButton} from './PlayButton';
import {ModalRouting} from '../navigators/Routing';
import {MiniProgressBar} from './PlayerProgressMini';
import {NavigationService} from '../navigators/navigation';
import {ClickIcon} from './ClickIcon';

const styles = StyleSheet.create({
	disabled: {
		opacity: 0.3
	},
	playerStrip: {
		borderTopWidth: 1
	},
	playerStripTrack: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
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
	playerStripControlsColumn: {
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},
	title: {
		fontSize: staticTheme.fontSize
	},
	artist: {
		fontSize: staticTheme.fontSizeSmall
	},
	button: {
		height: 30,
		width: 40,
		borderWidth: 1,
		borderRadius: 50 / 2,
		borderColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export const PlayerStrip: React.FC = () => {
	const track = useTrackPlayerCurrentTrack();
	const theme = useTheme();
	const {hasNext, hasPrevious} = useTrackPlayerHasSiblings();
	if (!track) {
		return (<></>);
	}
	const forwardDisabled = false;
	const backwardDisabled = false;
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
					<View style={styles.playerStripControlsColumn}>
						<ClickIcon disabled={backwardDisabled} fontSize={staticTheme.fontSizeSmall}
								   style={[styles.button, backwardDisabled && styles.disabled]} iconName="backward" onPress={JamPlayer.skipBackward}/>
						<ClickIcon disabled={!hasPrevious} fontSize={staticTheme.fontSizeSmall}
								   style={[styles.button, !hasPrevious && styles.disabled]} iconName="backward" onPress={JamPlayer.skipToPrevious}/>
					</View>
					<PlayButton/>
					<View style={styles.playerStripControlsColumn}>
						<ClickIcon disabled={forwardDisabled} fontSize={staticTheme.fontSizeSmall}
								   style={[styles.button, forwardDisabled && styles.disabled]} iconName="forward" onPress={JamPlayer.skipForward}/>
						<ClickIcon disabled={!hasNext} fontSize={staticTheme.fontSizeSmall}
								   style={[styles.button, !hasNext && styles.disabled]} iconName="step-forward" onPress={JamPlayer.skipToNext}/>
					</View>
				</View>
			</View>
			<MiniProgressBar/>
		</View>
	);
};

