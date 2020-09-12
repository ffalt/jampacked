import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
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
import {ThemedText} from '../components/ThemedText';
import {TrackEntry} from '../services/types';
import {useLazyPlaylistQuery} from '../services/queries/playlist';
import {useTheme} from '../style/theming';
import {ErrorView} from '../components/ErrorView';
import ActionSheet from 'react-native-actions-sheet';
import {ActionSheetTrack} from '../components/ActionSheetTrack';
import {ListEmpty} from '../components/ListEmpty';

export const PlaylistScreen: React.FC<HomeStackProps<HomeRoute.PLAYLIST>> = ({route}) => {
	const actionSheetRef: MutableRefObject<ActionSheet | null> = React.useRef<ActionSheet>(null);
	const theme = useTheme();
	const [currentTrack, setCurrentTrack] = useState<TrackEntry | undefined>();
	const [getPlaylist, {loading, error, playlist, called}] = useLazyPlaylistQuery();
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

	const showMenu = useCallback((item: TrackEntry): void => {
		setCurrentTrack(item);
		if (actionSheetRef.current) {
			actionSheetRef.current.setModalVisible();
		}
	}, [actionSheetRef]);

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item} showMenu={showMenu}/>),
		[showMenu]);

	const getItemLayout = React.useMemo(() => commonItemLayout(trackEntryHeight), []);

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
				keyExtractor={keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={ListHeader}
				ListEmptyComponent={<ListEmpty called={called} loading={loading}/>}
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

