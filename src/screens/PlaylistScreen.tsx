import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {trackEntryHeight, TrackItem} from '../components/TrackItem';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {Separator} from '../components/Separator';
import {JamObjectType} from '../services/jam';
import {FavIcon} from '../components/FavIcon';
import {snackError} from '../services/snack';
import {commonItemLayout} from '../components/AtoZList';
import PopupMenu, {PopupMenuAction, PopupMenuRef, usePopupMenuRef} from '../components/PopupMenu';
import {NavigationService} from '../services/navigation';
import {ThemedText} from '../components/ThemedText';
import {TrackEntry} from '../services/types';
import {useLazyPlaylistQuery} from '../services/queries/playlist';
import {useTheme} from '../style/theming';
import {ErrorView} from '../components/ErrorView';

export const PlaylistScreen: React.FC<HomeStackProps<HomeRoute.PLAYLIST>> = ({route}) => {
	const theme = useTheme();
	const [popupMenuActions, setPopupMenuActions] = useState<Array<PopupMenuAction>>([]);
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

	const playTracks = useCallback((): void => {
		if (playlist?.tracks) {
			JamPlayer.playTracks(playlist.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	}, [playlist]);

	const headerTitleCmds = (
		<>
			<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
				<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
			</TouchableOpacity>
			<FavIcon style={objHeaderStyles.button} objType={JamObjectType.playlist} id={id}/>
		</>
	);

	const customDetails = (<ThemedText style={objHeaderStyles.panel}>{playlist?.comment}</ThemedText>);

	const ListHeader = (
		<ObjHeader
			id={id}
			title={name}
			typeName="Playlist"
			customDetails={customDetails}
			headerTitleCmds={headerTitleCmds}
		/>
	);

	const keyExtractor = (item: TrackEntry): string => item.id;

	const menuRef = usePopupMenuRef();
	const showMenu = useCallback((ref: PopupMenuRef, item: TrackEntry): void => {
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
					const tracks = playlist?.tracks || [];
					const index = tracks.indexOf(item);
					if (index >= 0) {
						JamPlayer.addTracksToQueue(tracks.slice(index))
							.catch(e => console.error(e));
					}
				}
			},
			{
				title: 'Open Track Profile',
				click: (): void => {
					NavigationService.navigateObj(JamObjectType.episode, item.id, item.title);
				}
			}
		];
		setPopupMenuActions(actions);
		if (menuRef.current) {
			menuRef.current.showMenu(ref);
		}
	}, [menuRef, playlist]);

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item} showMenu={showMenu}/>),
		[showMenu]);

	const getItemLayout = React.useMemo(() => commonItemLayout(trackEntryHeight), []);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<>
			<PopupMenu ref={menuRef} actions={popupMenuActions}/>
			<FlatList
				data={playlist?.tracks || []}
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

