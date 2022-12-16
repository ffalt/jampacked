import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {defaultShowArtistTrackDisplay, defaultTrackDisplay, TrackItem} from '../components/TrackItem';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {snackError} from '../services/snack';
import {Item} from '../components/Item';
import {FolderType} from '../services/jam';
import {Folder, FolderItem} from '../services/queries/folder';
import {ErrorView} from '../components/ErrorView';
import {useLazyFolderQuery} from '../services/queries/folder';
import {DefaultFlatList} from '../components/DefFlatList';
import {MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from './AlbumScreen';
import {TrackEntry} from '../services/types';
import ActionSheet from 'react-native-actions-sheet';
import {ActionSheetTrack} from '../components/ActionSheetTrack';
import {useTheme} from '../style/theming';

const buildDetails = (folder?: Folder): Array<HeaderDetail> => {
	let result: Array<HeaderDetail> = [];
	switch (folder?.type) {
		case FolderType.artist:
			result = [
				{title: 'Folders', value: `${folder?.folderCount || ''}`},
				{title: 'Tracks', value: `${folder?.trackCount || ''}`},
				{title: 'Genre', value: genreDisplay(folder?.genres) || ''}
			];
			break;
		case FolderType.multialbum:
		case FolderType.album:
			result = [
				{title: 'Artist', value: `${folder?.artist || ''}`},
				{title: 'Tracks', value: `${folder?.trackCount || ''}`},
				{title: 'Genre', value: genreDisplay(folder?.genres) || ''}
			];
			break;
		// case FolderType.unknown:
		// case FolderType.collection:
		// case FolderType.extras:
		default:
	}
	return result.filter(item => item.value.length > 0);
};

export const FolderScreen: React.FC<HomeRouteProps<HomeRoute.FOLDER>> = ({route}) => {
	const actionSheetRef: MutableRefObject<ActionSheet | null> = React.useRef<ActionSheet>(null);
	const [currentTrack, setCurrentTrack] = useState<TrackEntry | undefined>();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getFolder, {loading, error, folder}] = useLazyFolderQuery();
	const {id, name} = (route?.params || {});
	const theme = useTheme();

	useEffect(() => {
		if (id) {
			getFolder(id);
		}
	}, [getFolder, id]);

	useEffect(() => {
		if (folder) {
			setDetails(buildDetails(folder));
		}
	}, [folder]);

	const playTracks = (): void => {
		if (folder) {
			JamPlayer.playTracks(folder.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	};

	const ListHeaderComponent = (<ObjHeader
		id={id}
		title={name}
		typeName={folder?.type}
		details={details}
		headerTitleCmds={folder?.tracks?.length ? (
			<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
				<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
			</TouchableOpacity>
		) : undefined}
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

	const isVariousArtist = folder?.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME;

	const renderItem = useCallback(({item}: { item: FolderItem }): JSX.Element => {
		if (item.track) {
			return <TrackItem
				track={item.track}
				displayFunc={isVariousArtist ? defaultShowArtistTrackDisplay : defaultTrackDisplay}
				showMenu={showMenu}/>;
		}
		if (item.folder) {
			return <Item item={item.folder}/>;
		}
		return <></>;
	}, [isVariousArtist, showMenu]);

	const reload = useCallback((): void => {
		getFolder(id, true);
	}, [getFolder, id]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

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
				items={folder?.items}
				renderItem={renderItem}
				ListHeaderComponent={ListHeaderComponent}
				loading={loading}
				error={error}
				reload={reload}
			/>
		</>
	);
};
