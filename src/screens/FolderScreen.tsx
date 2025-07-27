import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { defaultShowArtistTrackDisplay, defaultTrackDisplay, TrackItem } from '../components/TrackItem';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { JamPlayer } from '../services/player';
import { HeaderDetail, ObjectHeader, objectHeaderStyles } from '../components/ObjectHeader.tsx';
import { genreDisplay } from '../utils/genre.utils';
import { snackError } from '../services/snack';
import { Item } from '../components/Item';
import { FolderType, JamObjectType } from '../services/jam';
import { Folder, FolderItem, useLazyFolderQuery } from '../services/queries/folder';
import { ErrorView } from '../components/ErrorView';
import { DefaultFlatList } from '../components/DefaultFlatList.tsx';
import { MUSICBRAINZ_VARIOUS_ARTISTS_NAME } from './AlbumScreen';
import { TrackEntry } from '../services/types';
import { FloatingAction } from 'react-native-floating-action';
import { ActionMenuItem, executeTrackMenuAction, trackMenuIcon, trackMenuMultiSelectActions, trackMenuSingleSelectActions } from '../components/ActionMenuTrack';
import { useTheme } from '../style/theming';
import { ClickIcon } from '../components/ClickIcon';
import { Rating } from '../components/Rating';

const buildDetails = (folder?: Folder): Array<HeaderDetail> => {
	let result: Array<HeaderDetail> = [];
	switch (folder?.type) {
		case FolderType.artist: {
			result = [
				{ title: 'Folders', value: `${folder?.folderCount || ''}` },
				{ title: 'Tracks', value: `${folder?.trackCount || ''}` },
				{ title: 'Genre', value: genreDisplay(folder?.genres) || '' }
			];
			break;
		}
		case FolderType.multialbum:
		case FolderType.album: {
			result = [
				{ title: 'Artist', value: `${folder?.artist || ''}` },
				{ title: 'Tracks', value: `${folder?.trackCount || ''}` },
				{ title: 'Genre', value: genreDisplay(folder?.genres) || '' }
			];
			break;
		}
		// case FolderType.unknown:
		// case FolderType.collection:
		// case FolderType.extras:
		default:
	}
	return result.filter(item => item.value.length > 0);
};

export const FolderScreen: React.FC<HomeRouteProps<HomeRoute.FOLDER>> = ({ route }) => {
	const theme = useTheme();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getFolder, { loading, error, folder }] = useLazyFolderQuery();
	const { id, name } = (route?.params || {});
	const selectActionReference: MutableRefObject<FloatingAction | null> = React.useRef<FloatingAction>(null);
	const [showCheck, setShowCheck] = useState<boolean>(false);
	const [selection, setSelection] = useState<Array<TrackEntry>>([]);
	const [actions, setActions] = useState<Array<ActionMenuItem>>([]);
	const buttonIcon = React.useMemo(() => trackMenuIcon(theme.floating.color), [theme]);
	const singleSelectActions = React.useMemo(() => trackMenuSingleSelectActions(theme.floating.background, theme.floating.color), [theme]);
	const multiSelectActions = React.useMemo(() => trackMenuMultiSelectActions(theme.floating.background, theme.floating.color), [theme]);

	const applySelection = useCallback((list: Array<TrackEntry>): void => {
		setActions(list.length === 1 ? singleSelectActions : multiSelectActions);
		setShowCheck(list.length > 0);
		setSelection(list);
	}, [setActions, setSelection, singleSelectActions, multiSelectActions]);

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
				.catch(error_ => {
					snackError(error_);
				});
		}
	};

	const ListHeaderComponent = (
		<ObjectHeader
			id={id}
			title={name}
			typeName={folder?.type}
			details={details}
			headerTitleCmds={folder?.tracks?.length ?
				(<ClickIcon iconName="play" onPress={playTracks} style={objectHeaderStyles.button} fontSize={objectHeaderStyles.buttonIcon.fontSize} />) :
				undefined}
			headerTitleCmdsExtras={<Rating fontSize={objectHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.folder} id={id} />}
		/>
	);

	const isVariousArtist = folder?.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME;

	const setSelected = useCallback((item: TrackEntry): void => {
		if (selection.includes(item)) {
			applySelection(selection.filter(t => t !== item));
		} else {
			applySelection([...selection, item]);
		}
	}, [selection, applySelection]);

	const pressFloatingAction = useCallback((buttonName?: string): void => {
		executeTrackMenuAction(selection, buttonName)
			.then(result => {
				if (result) {
					applySelection([]);
				}
			})
			.catch(console.error);
	}, [selection, applySelection]);

	const doubleTab = useCallback((track: TrackEntry): void => {
		JamPlayer.playTrack(track)
			.catch(console.error);
		applySelection([]);
	}, [applySelection]);

	const renderItem = useCallback(({ item }: { item: FolderItem }): React.JSX.Element => {
		if (item.track) {
			return (
				<TrackItem
					track={item.track}
					isSelected={selection.includes(item.track)}
					doubleTab={doubleTab}
					showCheck={showCheck}
					setSelected={setSelected}
					displayFunc={isVariousArtist ? defaultShowArtistTrackDisplay : defaultTrackDisplay}
				/>
			);
		}
		if (item.folder) {
			return <Item item={item.folder} />;
		}
		return <></>;
	}, [isVariousArtist, selection, setSelected, showCheck, doubleTab]);

	const reload = useCallback((): void => {
		getFolder(id, true);
	}, [getFolder, id]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload} />);
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
				ref={selectActionReference}
				visible={selection.length > 0}
				animated={false}
				showBackground={false}
				color={theme.floating.background}
				floatingIcon={buttonIcon}
				actions={actions}
				onPressItem={pressFloatingAction}
			/>
		</>
	);
};
