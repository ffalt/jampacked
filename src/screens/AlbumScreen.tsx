import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {trackEntryHeight, TrackItem} from '../components/TrackItem';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
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
import {NavigationService} from '../navigators/navigation';
import {TrackEntry} from '../services/types';
import {useLazyAlbumQuery} from '../services/queries/album';
import {useTheme} from '../style/theming';
import {ErrorView} from '../components/ErrorView';
import ActionSheet from 'react-native-actions-sheet';
import {ActionSheetTrack} from '../components/ActionSheetTrack';
import {ListEmpty} from '../components/ListEmpty';

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
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [currentTrack, setCurrentTrack] = useState<TrackEntry | undefined>();
	const [getAlbum, {loading, error, album, called}] = useLazyAlbumQuery();
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

	const reload = useCallback((): void => {
		getAlbum(id, true);
	}, [getAlbum, id]);

	const pinTracks = (): void => {
		if (album) {
			dataService.download(album.tracks)
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
				data={album?.tracks || []}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={ListHeader}
				ListEmptyComponent={<ListEmpty list={album?.tracks}/>}
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
