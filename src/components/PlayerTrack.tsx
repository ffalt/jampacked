import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { ThemedText } from './ThemedText';
import { staticTheme } from '../style/theming';
import { useTrackPlayerCurrentTrack } from '../services/player-api';
import { FavIcon } from './FavIcon';
import { objHeaderStyles } from './ObjHeader';
import { JamObjectType } from '../services/jam';
import { NavigationService } from '../navigators/navigation';
import { HomeRoute } from '../navigators/Routing';
import { sharedStyles } from '../style/shared';
import { useLazyTrackQuery } from '../services/queries/track';

const styles = StyleSheet.create({
	card: {
		padding: staticTheme.padding,
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		textAlign: 'center'
	},
	artist: {
		textAlign: 'center'
	},
	album: {
		textAlign: 'center'
	},
	annotation: {
		paddingTop: 8
	}
});

export const PlayerTrack: React.FC = () => {
	const currentTrack = useTrackPlayerCurrentTrack();
	const [getTrack, { track }] = useLazyTrackQuery();

	useEffect(() => {
		if (currentTrack?.id) {
			getTrack(currentTrack?.id);
		}
	}, [getTrack, currentTrack]);

	const clickArtist = (): void => {
		if (track?.artistID) {
			NavigationService.navigate(HomeRoute.ARTIST, { id: track?.artistID, name: track?.artist || '' });
		}
	};

	const clickTitle = (): void => {
		if (currentTrack?.id) {
			NavigationService.navigate(HomeRoute.TRACK, { id: currentTrack.id, name: currentTrack.title || '' });
		}
	};

	const clickAlbum = (): void => {
		if (track?.albumID) {
			NavigationService.navigate(HomeRoute.ALBUM, { id: track?.albumID, name: track?.album || '' });
		}
	};

	return (
		<View style={styles.card}>
			<TouchableOpacity onPress={clickTitle}>
				<ThemedText style={styles.title}>{currentTrack?.title}</ThemedText>
			</TouchableOpacity>
			<TouchableOpacity onPress={clickAlbum}>
				<ThemedText style={styles.album}>{currentTrack?.album}</ThemedText>
			</TouchableOpacity>
			<TouchableOpacity onPress={clickArtist}>
				<ThemedText style={styles.artist}>{currentTrack?.artist}</ThemedText>
			</TouchableOpacity>
			<View style={styles.annotation}>
				<FavIcon style={objHeaderStyles.button} fontSize={objHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.track} id={currentTrack?.id}/>
			</View>
		</View>
	);
};
