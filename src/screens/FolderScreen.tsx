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
import {FloatingAction} from 'react-native-floating-action';
import {executeTrackMenuAction, trackMenuIcon, trackMenuMultiSelectActions, trackMenuSingleSelectActions} from '../components/ActionMenuTrack';

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
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getFolder, {loading, error, folder}] = useLazyFolderQuery();
	const {id, name} = (route?.params || {});
	const selectActionRef: MutableRefObject<FloatingAction | null> = React.useRef<FloatingAction>(null);
	const [selection, setSelection] = useState<Array<TrackEntry>>([]);

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

	const isVariousArtist = folder?.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME;

	const setSelected = useCallback((item: TrackEntry): void => {
		if (selection.includes(item)) {
			setSelection(selection.filter(t => t !== item));
		} else {
			setSelection(selection.concat([item]));
		}
	}, [selection, setSelection]);

	const pressFloatingAction = useCallback((buttonName?: string): void => {
		executeTrackMenuAction(selection, buttonName).then(result => {
			if (result) {
				setSelection([]);
			}
		});
	}, [selection, setSelection]);

	const doubleTab = useCallback((track: TrackEntry): void => {
		JamPlayer.playTrack(track)
			.catch(e => console.error(e));
		setSelection([]);
	}, [setSelection]);

	const renderItem = useCallback(({item}: { item: FolderItem }): JSX.Element => {
		if (item.track) {
			return (<TrackItem
				track={item.track}
				isSelected={selection.includes(item.track)}
				doubleTab={doubleTab}
				setSelected={setSelected}
				displayFunc={isVariousArtist ? defaultShowArtistTrackDisplay : defaultTrackDisplay}
			/>);
		}
		if (item.folder) {
			return <Item item={item.folder}/>;
		}
		return <></>;
	}, [isVariousArtist, selection, setSelected]);

	const reload = useCallback((): void => {
		getFolder(id, true);
	}, [getFolder, id]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<>
			<DefaultFlatList
				items={folder?.items}
				renderItem={renderItem}
				ListHeaderComponent={ListHeaderComponent}
				loading={loading}
				error={error}
				reload={reload}
			/>
			<FloatingAction
				ref={selectActionRef}
				visible={selection.length > 0}
				animated={false}
				showBackground={false}
				floatingIcon={trackMenuIcon}
				actions={selection.length === 1 ? trackMenuSingleSelectActions : trackMenuMultiSelectActions}
				onPressItem={pressFloatingAction}
			/>
		</>
	);
};
