import React, {useCallback, useContext, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {AlbumRoute, AlbumRouteProps, HomeRoute} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {JamObjectType} from '../services/jam';
import {FavIcon} from '../components/FavIcon';
import {snackError} from '../services/snack';
import {NavigationService} from '../navigators/navigation';
import {PinIcon} from '../components/PinIcon';
import {useLazyAlbumQuery} from '../services/queries/album';
import {Tracks} from '../components/Tracks';
import {defaultShowArtistTrackDisplay, defaultTrackDisplay} from '../components/TrackItem';
import {AlbumTabNavigatorContext} from '../navigators/AlbumNavigatorContext';

export const MUSICBRAINZ_VARIOUS_ARTISTS_NAME = 'Various Artists';

const buildDetails = (artist?: string, tracks?: number, genre?: string, click?: () => void): Array<HeaderDetail> => {
	return [
		{title: 'Artist', value: artist || '', click: artist ? click : undefined},
		{title: 'Tracks', value: `${tracks || ''}`},
		{title: 'Genre', value: genre || ''}
	];
};

export const AlbumScreen: React.FC<AlbumRouteProps<AlbumRoute.MAIN>> = () => {
	const state = useContext(AlbumTabNavigatorContext);
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getAlbum, {loading, error, album}] = useLazyAlbumQuery();
	const id = state.id || '';
	const name = state.name || '';

	useEffect(() => {
		if (id) {
			getAlbum(id);
		}
	}, [id, getAlbum]);

	useEffect(() => {
		if (album) {
			setDetails(buildDetails(album.artistName, album.trackCount, genreDisplay(album.genres), (): void => {
				if (album && album.artistID) {
					NavigationService.navigate(HomeRoute.ARTIST, {id: album.artistID, name: album.artistName || ''});
				}
			}));
		}
	}, [album]);

	const reload = useCallback((): void => {
		getAlbum(id, true);
	}, [getAlbum, id]);

	const playTracks = (): void => {
		if (album) {
			JamPlayer.playTracks(album.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	};
	const ListHeaderComponent = (<ObjHeader
		id={id}
		title={name}
		typeName={album?.albumType}
		details={details}
		headerTitleCmds={
			<>
				<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
					<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
				</TouchableOpacity>
				<PinIcon style={objHeaderStyles.button} objType={JamObjectType.album} id={id}/>
				<FavIcon style={objHeaderStyles.button} objType={JamObjectType.album} id={id}/>
			</>
		}
	/>);
	return (
		<Tracks
			tracks={album?.tracks}
			ListHeaderComponent={ListHeaderComponent}
			refreshing={loading}
			error={error}
			onRefresh={reload}
			displayFunc={album?.artistName === MUSICBRAINZ_VARIOUS_ARTISTS_NAME ? defaultShowArtistTrackDisplay : defaultTrackDisplay}
		/>
	);
};
