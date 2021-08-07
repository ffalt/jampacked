import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {TrackItem} from '../components/TrackItem';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {JamObjectType} from '../services/jam';
import {FavIcon} from '../components/FavIcon';
import {snackError} from '../services/snack';
import {NavigationService} from '../navigators/navigation';
import {TrackEntry} from '../services/types';
import {useTheme} from '../style/theming';
import ActionSheet from 'react-native-actions-sheet';
import {ActionSheetTrack} from '../components/ActionSheetTrack';
import {PinIcon} from '../components/PinIcon';
import {useLazyAlbumQuery} from '../services/queries/album.hook';
import {DefaultFlatList} from '../components/DefFlatList';

export const MUSICBRAINZ_VARIOUS_ARTISTS_NAME = 'Various Artists';

const buildDetails = (artist?: string, tracks?: number, genre?: string, click?: () => void): Array<HeaderDetail> => {
	return [
		{title: 'Artist', value: artist || '', click: artist ? click : undefined},
		{title: 'Tracks', value: `${tracks || ''}`},
		{title: 'Genre', value: genre || ''}
	];
};

export const AlbumScreen: React.FC<HomeRouteProps<HomeRoute.ALBUM>> = ({route}) => {
	const actionSheetRef: MutableRefObject<ActionSheet | null> = React.useRef<ActionSheet>(null);
	const theme = useTheme();
	const [isVariousArtist, setIsVariousArtist] = useState<boolean>(false);
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [currentTrack, setCurrentTrack] = useState<TrackEntry | undefined>();
	const [getAlbum, {loading, error, album}] = useLazyAlbumQuery();
	const {id, name} = route?.params;

	useEffect(() => {
		if (id) {
			getAlbum(id);
		}
	}, [id, getAlbum]);

	useEffect(() => {
		if (album) {
			setIsVariousArtist(album.artistName === MUSICBRAINZ_VARIOUS_ARTISTS_NAME);
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

	const showMenu = useCallback((item: TrackEntry): void => {
		setCurrentTrack(item);
		if (actionSheetRef.current) {
			actionSheetRef.current.setModalVisible(true);
		}
	}, [actionSheetRef]);

	const closeMenu = useCallback((): void => {
		if (actionSheetRef.current) {
			actionSheetRef.current.setModalVisible(false);
		}
	}, [actionSheetRef]);

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item} showMenu={showMenu} showArtist={isVariousArtist}/>),
		[showMenu, isVariousArtist]);

	return (
		<>
			<ActionSheet
				initialOffsetFromBottom={1}
				ref={actionSheetRef}
				bounceOnOpen={true}
				bounciness={8}
				gestureEnabled={true}
				containerStyle={{backgroundColor: theme.background}}
				defaultOverlayOpacity={0.3}>
				<ActionSheetTrack item={currentTrack} close={closeMenu}/>
			</ActionSheet>
			<DefaultFlatList
				items={album?.tracks}
				renderItem={renderItem}
				ListHeaderComponent={ListHeaderComponent}
				loading={loading}
				error={error}
				reload={reload}
			/>
		</>
	);
};
