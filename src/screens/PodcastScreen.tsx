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
import {useLazyPodcastQuery} from '../services/queries/podcast';
import {useTheme} from '../style/theming';
import {ErrorView} from '../components/ErrorView';

export const PodcastScreen: React.FC<HomeStackProps<HomeRoute.PODCAST>> = ({route}) => {
	const theme = useTheme();
	const [popupMenuActions, setPopupMenuActions] = useState<Array<PopupMenuAction>>([]);
	const [getPodcast, {loading, error, podcast}] = useLazyPodcastQuery();
	const {id, name} = route?.params;

	useEffect(() => {
		if (id) {
			getPodcast(id);
		}
	}, [getPodcast, id]);

	const reload = useCallback((): void => {
		getPodcast(id, true);
	}, [getPodcast, id]);

	const playTracks = useCallback((): void => {
		if (podcast?.episodes) {
			JamPlayer.playTracks(podcast.episodes)
				.catch(e => {
					snackError(e);
				});
		}
	}, [podcast]);

	const headerTitleCmds = (
		<>
			<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
				<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
			</TouchableOpacity>
			<FavIcon style={objHeaderStyles.button} objType={JamObjectType.podcast} id={id}/>
		</>
	);

	const customDetails = (<ThemedText style={objHeaderStyles.panel}>{podcast?.description}</ThemedText>);

	const ListHeader = (
		<ObjHeader
			id={id}
			title={name}
			typeName="Podcast"
			customDetails={customDetails}
			headerTitleCmds={headerTitleCmds}
		/>
	);

	const keyExtractor = (item: TrackEntry): string => item.id;

	const menuRef = usePopupMenuRef();

	const showMenu = useCallback((ref: PopupMenuRef, item: TrackEntry): void => {
		const actions = [
			{
				title: 'Play Episode',
				click: (): void => {
					JamPlayer.playTrack(item)
						.catch(e => console.error(e));
				}
			},
			{
				title: 'Add Episodes to Queue',
				click: (): void => {
					JamPlayer.addTrackToQueue(item)
						.catch(e => console.error(e));
				}
			},
			{
				title: 'Add Episodes from here to Queue',
				click: (): void => {
					const tracks = podcast?.episodes || [];
					const index = tracks.indexOf(item);
					if (index >= 0) {
						JamPlayer.addTracksToQueue(tracks.slice(index))
							.catch(e => console.error(e));
					}
				}
			},
			{
				title: 'Open Episode Profile',
				click: (): void => {
					NavigationService.navigateObj(JamObjectType.episode, item.id, item.title);
				}
			}
		];
		setPopupMenuActions(actions);
		if (menuRef.current) {
			menuRef.current.showMenu(ref);
		}
	}, [menuRef, podcast]);

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
				data={podcast?.episodes || []}
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

