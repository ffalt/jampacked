import React, {useCallback, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {JamObjectType} from '../services/jam';
import {FavIcon} from '../components/FavIcon';
import {snackError} from '../services/snack';
import {ThemedText} from '../components/ThemedText';
import {useLazyPlaylistQuery} from '../services/queries/playlist.hook';
import {Tracks} from '../components/Tracks';

export const PlaylistScreen: React.FC<HomeRouteProps<HomeRoute.PLAYLIST>> = ({route}) => {
	const [getPlaylist, {loading, error, playlist}] = useLazyPlaylistQuery();
	const {id, name} = route?.params;

	useEffect(() => {
		if (id) {
			getPlaylist(id);
		}
	}, [getPlaylist, id]);

	const reload = useCallback((): void => {
		getPlaylist(id, true);
	}, [getPlaylist, id]);

	const playTracks = (): void => {
		if (playlist?.tracks) {
			JamPlayer.playTracks(playlist.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	};

	const ListHeaderComponent = (<ObjHeader
		id={id}
		title={name}
		typeName="Playlist"
		customDetails={<ThemedText style={objHeaderStyles.panel}>{playlist?.comment}</ThemedText>}
		headerTitleCmds={<>
			<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
				<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
			</TouchableOpacity>
			<FavIcon style={objHeaderStyles.button} objType={JamObjectType.playlist} id={id}/>
		</>}
	/>);

	return (
		<Tracks
			tracks={playlist?.tracks}
			ListHeaderComponent={ListHeaderComponent}
			refreshing={loading}
			error={error}
			onRefresh={reload}
			showArtist={true}
		/>
	);
};

