import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AlbumRoute, AlbumRouteProps, HomeRoute } from '../navigators/Routing';
import { JamPlayer } from '../services/player';
import { HeaderDetail, ObjectHeader, objectHeaderStyles } from '../components/ObjectHeader.tsx';
import { genreDisplay } from '../utils/genre.utils';
import { JamObjectType } from '../services/jam';
import { FavIcon } from '../components/FavIcon';
import { snackError } from '../services/snack';
import { NavigationService } from '../navigators/navigation';
import { useLazyAlbumQuery } from '../services/queries/album';
import { Tracks } from '../components/Tracks';
import { defaultShowArtistTrackDisplay, defaultTrackDisplay } from '../components/TrackItem';
import { AlbumTabNavigatorContext } from '../navigators/AlbumNavigatorContext';
import { PinIcon } from '../components/PinIcon';
import { ClickIcon } from '../components/ClickIcon';
import { Rating } from '../components/Rating';

export const MUSICBRAINZ_VARIOUS_ARTISTS_NAME = 'Various Artists';

const buildDetails = (artist?: string, tracks?: number, genre?: string, click?: () => void): Array<HeaderDetail> => [
	{ title: 'Artist', value: artist || '', click: artist ? click : undefined },
	{ title: 'Tracks', value: `${tracks || ''}` },
	{ title: 'Genre', value: genre || '' }
];

export const AlbumScreen: React.FC<AlbumRouteProps<AlbumRoute.MAIN>> = () => {
	const state = useContext(AlbumTabNavigatorContext);
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getAlbum, { loading, error, album }] = useLazyAlbumQuery();
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
					NavigationService.navigate(HomeRoute.ARTIST, { id: album.artistID, name: album.artistName || '' });
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
				.catch(error_ => {
					snackError(error_);
				});
		}
	};
	const ListHeaderComponent = (
		<ObjectHeader
			id={id}
			title={name}
			typeName={album?.albumType}
			details={details}
			headerTitleCmds={(
				<>
					<ClickIcon style={objectHeaderStyles.button} fontSize={objectHeaderStyles.buttonIcon.fontSize} iconName="play" onPress={playTracks} />
					<PinIcon style={objectHeaderStyles.button} fontSize={objectHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.album} id={id} />
					<FavIcon style={objectHeaderStyles.button} fontSize={objectHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.album} id={id} />
				</>
			)}
			headerTitleCmdsExtras={<Rating fontSize={objectHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.album} id={id} />}
		/>
	);
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
