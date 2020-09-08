import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';
import {TrackItem} from '../components/TrackItem';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from '../components/ThemedIcon';
import {HeaderDetail, ObjHeader} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {Separator} from '../components/Separator';
import {snackError} from '../services/snack';
import {Item} from '../components/Item';
import {FolderType} from '../services/jam';
import {Folder, FolderItem, useLazyFolderQuery} from '../services/queries/folder';
import {useTheme} from '../style/theming';
import {ErrorView} from '../components/ErrorView';

const styles = StyleSheet.create({
	playButton: {
		height: 24,
		width: 24,
		borderWidth: 1,
		borderRadius: 30 / 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	playButtonIcon: {
		fontSize: 10
	}
});

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

export const FolderScreen: React.FC<HomeStackProps<HomeRoute.FOLDER>> = ({route}) => {
	const theme = useTheme();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getFolder, {loading, error, folder}] = useLazyFolderQuery();
	const {id, name} = route?.params;

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

	const playTracks = useCallback((): void => {
		if (folder) {
			JamPlayer.playTracks(folder.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	}, [folder]);

	const headerTitleCmds = folder?.tracks?.length ? (
		<TouchableOpacity
			style={[styles.playButton, {borderColor: theme.textColor}]}
			onPress={playTracks}
		>
			<ThemedIcon name="play" size={styles.playButtonIcon.fontSize}/>
		</TouchableOpacity>
	) : undefined;

	const ListHeader = (
		<ObjHeader
			id={id}
			title={name}
			typeName={folder?.type}
			details={details}
			headerTitleCmds={headerTitleCmds}
		/>
	);

	const keyExtractor = (item: FolderItem): string => item.id;

	const renderItem = useCallback(({item}: { item: FolderItem }): JSX.Element => {
		if (item.track) {
			return <TrackItem track={item.track}/>;
		}
		if (item.folder) {
			return <Item item={item.folder}/>;
		}
		return <></>;
	}, []);

	const reload = useCallback((): void => {
		getFolder(id, true);
	}, [getFolder, id]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<FlatList
			data={folder?.items || []}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			ItemSeparatorComponent={Separator}
			ListHeaderComponent={ListHeader}
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={90}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		/>
	);
};
