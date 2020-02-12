import React from 'react';
import {FlatList, RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import {withTheme} from '../style/theming';
import TrackItem from '../components/TrackItem';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import ThemedIcon from '../components/ThemedIcon';
import ObjHeader, {HeaderDetail} from '../components/ObjHeader';
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
		details: Array<HeaderDetail>;
		refreshing: boolean;
	} = {
		details: this.buildDetails(),
		data: undefined,
		list: [],
		refreshing: false
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.setState({list: [], data: undefined, details: this.buildDetails()});
			this.load();
		}
	}

	private buildDetails(artist?: string, tracks?: number, genre?: string): Array<HeaderDetail> {
		return [
			{title: 'Artist', value: `${artist || ''}`},
			{title: 'Tracks', value: `${tracks || ''}`},
			{title: 'Genre', value: genre || ''}
		];
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
				const details = this.buildDetails(data.folder.tag?.artist, data.folder.trackCount, genreDisplay(data.folder.tag?.genres));
				this.setState({data, details, list, refreshing: false});
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
				typeName={this.state.data?.folder?.type}
				details={this.state.details}
				headerTitleCmds={headerTitleCmds}
			/>
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
