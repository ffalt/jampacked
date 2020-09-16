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
import {ActionSheetEpisode} from '../components/ActionSheetEpisode';
import {ListEmpty} from '../components/ListEmpty';
import {useLazyPodcastQuery} from '../services/queries/podcast.hook';
import {defaultItemLayout, defaultKeyExtractor} from '../utils/list.utils';

export const PodcastScreen: React.FC<HomeRouteProps<HomeRoute.PODCAST>> = ({route}) => {
	const actionSheetRef: MutableRefObject<ActionSheet | null> = React.useRef<ActionSheet>(null);
	const theme = useTheme();
	const [getPodcast, {loading, error, podcast}] = useLazyPodcastQuery();
	const [currentEpisode, setCurrentEpisode] = useState<TrackEntry | undefined>();
	const {id, name} = route?.params;

	useEffect(() => {
		if (id) {
			getPodcast(id);
		}
	}, [getPodcast, id]);

	const reload = useCallback((): void => {
		getPodcast(id, true);
	}, [getPodcast, id]);

	const ListHeaderComponent = useCallback((): JSX.Element => {
		const playTracks = (): void => {
			if (podcast?.episodes) {
				JamPlayer.playTracks(podcast.episodes)
					.catch(e => {
						snackError(e);
					});
			}
		};
		const customDetails = (<ThemedText style={objHeaderStyles.panel}>{podcast?.description}</ThemedText>);
		const headerTitleCmds = (
			<>
				<TouchableOpacity style={objHeaderStyles.button} onPress={playTracks}>
					<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
				</TouchableOpacity>
				<FavIcon style={objHeaderStyles.button} objType={JamObjectType.podcast} id={id}/>
			</>
		);
		return (
			<ObjHeader
				id={id}
				title={name}
				typeName="Podcast"
				customDetails={customDetails}
				headerTitleCmds={headerTitleCmds}
			/>
		);
	}, [podcast, id, name]);

	const showMenu = useCallback((item: TrackEntry): void => {
		setCurrentEpisode(item);
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
				<ActionSheetEpisode item={currentEpisode}/>
			</ActionSheet>
			<FlatList
				data={podcast?.episodes || []}
				renderItem={renderItem}
				keyExtractor={defaultKeyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={ListHeaderComponent}
				ListEmptyComponent={<ListEmpty list={podcast?.episodes}/>}
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

