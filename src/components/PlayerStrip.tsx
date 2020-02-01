import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {JamPlayer, useCurrentTrack} from '../services/player';
import JamImage from './JamImage';
import ThemedText from './ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import ThemedIcon from './ThemedIcon';
import PlayButton from './PlayButton';
import {ModalRouting} from '../navigators/Routing';
import {MiniProgressBar} from './PlayerProgressMini';

const styles = StyleSheet.create({
	progress: {
		height: 1
	},
	disabled: {
		opacity: 0.3
	},
	playerStrip: {
		borderTopWidth: 1
	},
	modal: {
		backgroundColor: 'black',
		margin: 0,
		padding: 0
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

const PlayerStrip: React.FC = () => {
	const track = useCurrentTrack();
	const navigation = useNavigation();
	const theme = useTheme();
	if (!track) {
		return (<></>);
	}
	const forwardDisabled = false;
	const showPlayer = (): void => {
		navigation.navigate(ModalRouting.PLAYER);
	};
	return (
		<View style={[styles.playerStrip, {borderTopColor: theme.separator, backgroundColor: theme.control}]}>
			<View style={styles.playerStripContent}>
				<TouchableOpacity onPress={showPlayer} style={styles.playerStripTrack}>
					<View style={styles.playerStripImage}>
						<JamImage id={track.id} size={46}/>
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
					<TouchableOpacity disabled={forwardDisabled} onPress={JamPlayer.skipForward} style={styles.button}>
						<ThemedIcon name="forward" style={forwardDisabled && styles.disabled}/>
					</TouchableOpacity>
				</View>
			</View>
			<MiniProgressBar theme={theme}/>
		</View>
	);
};

export default PlayerStrip;
