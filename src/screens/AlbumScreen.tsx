import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {trackEntryHeight, TrackItem} from '../components/TrackItem';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {Separator} from '../components/Separator';
import dataService from '../services/data';
import {JamObjectType} from '../services/jam';
import {FavIcon} from '../components/FavIcon';
import {snackError} from '../services/snack';
import {commonItemLayout} from '../components/AtoZList';
import PopupMenu, {PopupMenuAction, usePopupMenuRef} from '../components/PopupMenu';
import {NavigationService} from '../services/navigation';
import {TrackEntry} from '../services/types';
import {useLazyAlbumQuery} from '../services/queries/album';
import {useTheme} from '../style/theming';

const buildDetails = (artist?: string, tracks?: number, genre?: string, click?: () => void): Array<HeaderDetail> => {
	return [
		{title: 'Artist', value: artist || '', click: artist ? click : undefined},
		{title: 'Tracks', value: `${tracks || ''}`},
		{title: 'Genre', value: genre || ''}
	];
};

export const AlbumScreen: React.FC<HomeStackProps<HomeRoute.ALBUM>> = ({route}) => {
	const theme = useTheme();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [popupMenuActions, setPopupMenuActions] = useState<Array<PopupMenuAction>>([]);
	const [getAlbum, {loading, error, album}] = useLazyAlbumQuery();
	const {id, name} = route?.params;

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

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		getAlbum(id, true);
	}, [getAlbum, id]);

	const pinTracks = (): void => {
		if (album) {
			dataService.mediaCache.download(album.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	};

	const playTracks = (): void => {
		if (album) {
			JamPlayer.playTracks(album.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	};

	const headerTitleCmds = (
		<>
			<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
				<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
			</TouchableOpacity>
			<TouchableOpacity style={objHeaderStyles.button} onPress={pinTracks}>
				<ThemedIcon name="pin-outline" size={objHeaderStyles.buttonIcon.fontSize}/>
			</TouchableOpacity>
			<FavIcon style={objHeaderStyles.button} objType={JamObjectType.album} id={id}/>
		</>
	);

	const ListHeader = (
		<ObjHeader
			id={id}
			title={name}
			typeName={album?.albumType}
			details={details}
			headerTitleCmds={headerTitleCmds}
		/>
	);

	const keyExtractor = (item: TrackEntry): string => item.id;

	const menuRef = usePopupMenuRef();
	const showMenu = useCallback((ref: React.RefObject<any>, item: TrackEntry): void => {
		const actions = [
			{
				title: 'Play Track',
				click: (): void => {
					JamPlayer.playTrack(item)
						.catch(e => console.error(e));
				}
			},
			{
				title: 'Add Track to Queue',
				click: (): void => {
					JamPlayer.addTrackToQueue(item)
						.catch(e => console.error(e));
				}
			},
			{
				title: 'Add Tracks from here to Queue',
				click: (): void => {
					if (album) {
						const index = album.tracks.indexOf(item);
						if (index >= 0) {
							JamPlayer.addTracksToQueue(album.tracks.slice(index))
								.catch(e => console.error(e));
						}
					}
				}
			},
			{
				title: 'Open Track Profile',
				click: (): void => {
					NavigationService.navigateObj(JamObjectType.track, item.id, item.title);
				}
			}
		];
		setPopupMenuActions(actions);
		if (menuRef.current) {
			menuRef.current.showMenu(ref);
		}
	}, [album, menuRef]);

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item} showMenu={showMenu}/>),
		[showMenu]);

	const getItemLayout = React.useMemo(() => commonItemLayout(trackEntryHeight), []);

	return (
		<>
			<PopupMenu ref={menuRef} actions={popupMenuActions}/>
			<FlatList
				data={album?.tracks || []}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={ListHeader}
				getItemLayout={getItemLayout}
				refreshControl={(
					<RefreshControl
						refreshing={loading}
						onRefresh={reload}
						progressViewOffset={80}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			/>
		</>
	);
};
