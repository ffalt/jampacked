import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { defaultShowArtistTrackDisplay, defaultTrackDisplay, TrackItem } from '../components/TrackItem';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { JamPlayer } from '../services/player.service.ts';
import { HeaderDetail, ObjectHeader, objectHeaderStyles } from '../components/ObjectHeader.tsx';
import { genreDisplay } from '../utils/genre.utils';
import { snackError } from '../utils/snack.ts';
import { Item } from '../components/Item';
import { FolderType, JamObjectType } from '../services/jam';
import { Folder, FolderItem, useLazyFolderQuery } from '../services/queries/folder';
import { ErrorView } from '../components/ErrorView';
import { DefaultFlatList } from '../components/DefaultFlatList.tsx';
import { MUSICBRAINZ_VARIOUS_ARTISTS_NAME } from './AlbumScreen';
import { executeTrackMenuAction } from '../components/ActionMenuTrack';
import { staticTheme, useTheme } from '../style/theming';
import { ClickIcon } from '../components/ClickIcon';
import { Rating } from '../components/Rating';
import { TrackEntry } from '../types/track.ts';
import { ThemedText } from '../components/ThemedText';
import { ThemedIcon } from '../components/ThemedIcon';
import { formatDuration } from '../utils/duration.utils';

interface SelectionAction {
	name: string;
	icon: string;
	label: string;
}

const multiSelectActions: Array<SelectionAction> = [
	{ name: 'bt_m_play', icon: 'play', label: 'Play selected tracks' },
	{ name: 'bt_m_queue', icon: 'list-add', label: 'Add to queue' },
	{ name: 'bt_clear', icon: 'minus', label: 'Clear selection' }
];

const singleSelectActions: Array<SelectionAction> = [
	{ name: 'bt_s_play', icon: 'play', label: 'Play track' },
	{ name: 'bt_s_queue', icon: 'list-add', label: 'Add to queue' },
	{ name: 'bt_s_open', icon: 'track', label: 'Open track details' }
];

const styles = StyleSheet.create({
	selectionContainer: {
		position: 'absolute',
		bottom: staticTheme.paddingLarge,
		right: staticTheme.padding,
		alignItems: 'flex-end',
		gap: staticTheme.paddingSmall
	},
	selectionInfo: {
		paddingHorizontal: staticTheme.paddingLarge,
		paddingVertical: staticTheme.padding,
		borderRadius: 20,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4
	},
	selectionText: {
		fontSize: staticTheme.fontSize,
		fontWeight: '500'
	},
	actionsRow: {
		flexDirection: 'row',
		borderRadius: 25,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		overflow: 'hidden'
	},
	actionButton: {
		paddingHorizontal: staticTheme.paddingLarge + 5,
		paddingVertical: staticTheme.paddingLarge,
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 56
	},
	actionIcon: {
		fontSize: 26
	},
	tooltip: {
		paddingHorizontal: staticTheme.padding,
		paddingVertical: staticTheme.paddingSmall,
		borderRadius: 8,
		marginBottom: staticTheme.paddingSmall
	},
	tooltipText: {
		fontSize: staticTheme.fontSizeSmall
	}
});

const buildDetails = (folder?: Folder): Array<HeaderDetail> => {
	let result: Array<HeaderDetail> = [];
	switch (folder?.type) {
		case FolderType.artist: {
			result = [
				{ title: 'Folders', value: `${folder?.folderCount ?? ''}` },
				{ title: 'Tracks', value: `${folder?.trackCount ?? ''}` },
				{ title: 'Genre', value: genreDisplay(folder?.genres) }
			];
			break;
		}
		case FolderType.multialbum:
		case FolderType.album: {
			result = [
				{ title: 'Artist', value: `${folder?.artist ?? ''}` },
				{ title: 'Tracks', value: `${folder?.trackCount ?? ''}` },
				{ title: 'Genre', value: genreDisplay(folder?.genres) }
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
	const [getFolder, { loading, error, folder }] = useLazyFolderQuery();
	const { id, name } = (route?.params || {});
	const [showCheck, setShowCheck] = useState<boolean>(false);
	const [selection, setSelection] = useState<Array<TrackEntry>>([]);
	const [tooltip, setTooltip] = useState<string | null>(null);
	const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showTooltip = useCallback((label: string): void => {
		if (tooltipTimeout.current) {
			clearTimeout(tooltipTimeout.current);
		}
		setTooltip(label);
		tooltipTimeout.current = setTimeout(() => {
			setTooltip(null);
		}, 1500);
	}, []);

	useEffect(() => (): void => {
		if (tooltipTimeout.current) {
			clearTimeout(tooltipTimeout.current);
		}
	}, []);

	const selectionInfo = useMemo(() => {
		if (selection.length === 0) {
			return null;
		}
		const totalDuration = selection.reduce((sum, track) => sum + track.durationMS, 0);
		return {
			count: selection.length,
			duration: formatDuration(totalDuration)
		};
	}, [selection]);

	const actions = useMemo((): Array<SelectionAction> => {
		if (selection.length === 0) {
			return [];
		}
		return selection.length === 1 ? singleSelectActions : multiSelectActions;
	}, [selection]);

	const applySelection = useCallback((list: Array<TrackEntry>): void => {
		setShowCheck(list.length > 0);
		setSelection(list);
	}, []);

	useEffect(() => {
		if (id) {
			getFolder(id);
		}
	}, [getFolder, id]);

	const details = useMemo(() => buildDetails(folder), [folder]);

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

	const pressAction = useCallback((actionName: string): void => {
		executeTrackMenuAction(selection, actionName)
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
			{selectionInfo && (
				<View style={styles.selectionContainer}>
					<View style={[styles.selectionInfo, { backgroundColor: theme.floating.background }]}>
						<ThemedText style={[styles.selectionText, { color: theme.floating.color }]}>
							{`${selectionInfo.count} ${selectionInfo.count === 1 ? 'track' : 'tracks'} · ${selectionInfo.duration}`}
						</ThemedText>
					</View>
					{tooltip && (
						<View style={[styles.tooltip, { backgroundColor: theme.floating.background }]}>
							<ThemedText style={[styles.tooltipText, { color: theme.floating.color }]}>
								{tooltip}
							</ThemedText>
						</View>
					)}
					<View style={[styles.actionsRow, { backgroundColor: theme.floating.background }]}>
						{actions.map(action => (
							<Pressable
								key={action.name}
								style={styles.actionButton}
								onPress={(): void => pressAction(action.name)}
								onLongPress={(): void => showTooltip(action.label)}
							>
								<ThemedIcon name={action.icon} color={theme.floating.color} style={styles.actionIcon} />
							</Pressable>
						))}
					</View>
				</View>
			)}
		</>
	);
};
