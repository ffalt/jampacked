import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {TrackItem} from '../components/TrackItem';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {Separator} from '../components/Separator';
import {JamObjectType} from '../services/jam';
import {FavIcon} from '../components/FavIcon';
import {snackError} from '../services/snack';
import {ThemedText} from '../components/ThemedText';
import {TrackEntry} from '../services/types';
import {useTheme} from '../style/theming';
import {ErrorView} from '../components/ErrorView';
import ActionSheet from 'react-native-actions-sheet';
import {ActionSheetTrack} from '../components/ActionSheetTrack';
import {ListEmpty} from '../components/ListEmpty';
import {useLazyPlaylistQuery} from '../services/queries/playlist.hook';
import {defaultItemLayout, defaultKeyExtractor} from '../utils/list.utils';

export const PlaylistScreen: React.FC<HomeRouteProps<HomeRoute.PLAYLIST>> = ({route}) => {
	const actionSheetRef: MutableRefObject<ActionSheet | null> = React.useRef<ActionSheet>(null);
	const theme = useTheme();
	const [currentTrack, setCurrentTrack] = useState<TrackEntry | undefined>();
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

	const ListHeaderComponent = useCallback((): JSX.Element => {
		const playTracks = (): void => {
			if (playlist?.tracks) {
				JamPlayer.playTracks(playlist.tracks)
					.catch(e => {
						snackError(e);
					});
			}
		};
		const customDetails = (<ThemedText style={objHeaderStyles.panel}>{playlist?.comment}</ThemedText>);

		const headerTitleCmds = (
			<>
				<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
					<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
				</TouchableOpacity>
				<FavIcon style={objHeaderStyles.button} objType={JamObjectType.playlist} id={id}/>
			</>
		);
		return (
			<ObjHeader
				id={id}
				title={name}
				typeName="Playlist"
				customDetails={customDetails}
				headerTitleCmds={headerTitleCmds}
			/>
		);
	}, [playlist, id, name]);


	const showMenu = useCallback((item: TrackEntry): void => {
		setCurrentTrack(item);
		if (actionSheetRef.current) {
			actionSheetRef.current.setModalVisible();
		}
	}, [actionSheetRef]);

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item} showMenu={showMenu}/>),
		[showMenu]);

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
				<ActionSheetTrack item={currentTrack}/>
			</ActionSheet>
			<FlatList
				data={playlist?.tracks || []}
				renderItem={renderItem}
				keyExtractor={defaultKeyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={ListHeaderComponent}
				ListEmptyComponent={<ListEmpty list={playlist?.tracks}/>}
				getItemLayout={defaultItemLayout}
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

