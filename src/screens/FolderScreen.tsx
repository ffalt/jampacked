import React from 'react';
import {FlatList, RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import {withTheme} from '../style/theming';
import TrackItem from '../components/TrackItem';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import ThemedIcon from '../components/ThemedIcon';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';
import dataService, {FolderData, FolderEntry, TrackEntry} from '../services/data';
import {snackError} from '../services/snack';
import Item from '../components/Item';

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

interface FolderItem {
	id: string;
	folder?: FolderEntry;
	track?: TrackEntry;
}

class FolderScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.FOLDER>> {
	state: {
		data?: FolderData;
		list: Array<FolderItem>;
		refreshing: boolean;
	} = {
		data: undefined,
		list: [],
		refreshing: false
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.setState({list: [], data: undefined});
			this.load();
		}
	}

	private load(forceRefresh: boolean = false): void {
		const {id} = this.props.route.params;
		if (!id) {
			return;
		}
		this.setState({refreshing: true});
		dataService.folder(id, forceRefresh)
			.then(data => {
				const folders: Array<FolderItem> = (data.folders || []).map(folder => ({folder, id: folder.id}));
				const tracks: Array<FolderItem> = (data.tracks || []).map(track => ({track, id: track.id}));
				const list: Array<FolderItem> = folders.concat(tracks);
				this.setState({data, list, refreshing: false});
			})
			.catch(e => {
				this.setState({refreshing: false});
				snackError(e);
			});
	}

	private playTracks = (): void => {
		if (this.state.data?.tracks) {
			JamPlayer.playTracks(this.state.data.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	};

	private renderHeader = (): JSX.Element => {
		const headerTitleCmds = this.state.data?.tracks?.length ? (
			<TouchableOpacity
				style={[styles.playButton, {borderColor: this.props.theme.textColor}]}
				onPress={this.playTracks}
			>
				<ThemedIcon name="play" style={styles.playButtonIcon}/>
			</TouchableOpacity>
		) : undefined;

		return (
			<ObjHeader
				id={this.props.route?.params?.id}
				title={this.props.route?.params?.name}
				headerTitleCmds={headerTitleCmds}
			>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Artist</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.folder.tag?.artist}</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Tracks</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.folder.trackCount}</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Genre</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{genreDisplay(this.state.data?.folder.tag?.genres)}</ThemedText>
			</ObjHeader>
		);
	};

	private keyExtractor = (item: FolderItem): string => item.id;

	private renderItem = ({item}: { item: FolderItem }): JSX.Element => {
		if (item.track) {
			return <TrackItem track={item.track}/>;
		}
		if (item.folder) {
			return <Item item={item.folder}/>;
		}
		return <View/>;
	};

	private reload = (): void => {
		this.load(true);
	};

	render(): React.ReactElement {
		const {theme} = this.props;
		return (
			<FlatList
				data={this.state.list}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				refreshControl={(
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this.reload}
						progressViewOffset={90}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			/>
		);
	}
}

export default withTheme(FolderScreen);
