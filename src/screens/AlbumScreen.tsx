import React from 'react';
import {FlatList, RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';
import {staticTheme, withTheme} from '../style/theming';
import TrackItem from '../components/TrackItem';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import ThemedIcon from '../components/ThemedIcon';
import ObjHeader, {HeaderDetail, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';
import dataService, {AlbumData, TrackEntry} from '../services/data';
import {JamObjectType} from '../services/jam';
import FavIcon from '../components/FavIcon';
import {snackError} from '../services/snack';

class AlbumScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ALBUM>> {
	state: {
		data?: AlbumData;
		refreshing: boolean;
		details: Array<HeaderDetail>;
	} = {
		refreshing: false,
		data: undefined,
		details: this.buildDetails()
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.setState({data: undefined, details: this.buildDetails()});
			this.load();
		}
	}

	private buildDetails(artist?: string, tracks?: number, genre?: string): Array<HeaderDetail> {
		return [
			{title: 'Artist', value: artist || '', click: artist ? this.toArtist : undefined},
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
		dataService.album(id, forceRefresh)
			.then(data => {
				const details = this.buildDetails(data.album.artist, data.album.trackCount, genreDisplay(data.album.genres));
				this.setState({data, details, refreshing: false});
			})
			.catch(e => {
				this.setState({refreshing: false});
				snackError(e);
			});
	}

	private reload = (): void => {
		this.load(true);
	};

	private toArtist = (): void => {
		if (this.state.data && this.state.data.album.artistID) {
			this.props.navigation.navigate(HomeRoute.ARTIST, {id: this.state.data.album.artistID, name: this.state.data.album.artist || ''});
		}
	};

	private playTracks = (): void => {
		if (this.state.data?.tracks) {
			JamPlayer.playTracks(this.state.data?.tracks)
				.catch(e => {
					snackError(e);
				});
		}
	};

	private renderHeader = (): JSX.Element => {
		const headerTitleCmds = (
			<>
				<TouchableOpacity style={objHeaderStyles.button} onPress={this.playTracks}>
					<ThemedIcon name="play" style={objHeaderStyles.buttonIcon}/>
				</TouchableOpacity>
				<FavIcon style={objHeaderStyles.button} objType={JamObjectType.album} id={this.props.route.params?.id}/>
			</>
		);
		const {details, data} = this.state;
		const typeName = data?.album?.albumType;
		const {id, name} = this.props.route?.params;
		return (
			<ObjHeader
				id={id}
				title={name}
				typeName={typeName}
				details={details}
				headerTitleCmds={headerTitleCmds}
			/>
		);
	};

	private keyExtractor = (item: TrackEntry): string => item.id;

	private renderItem = ({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item}/>);

	render(): React.ReactElement {
		const {theme} = this.props;
		return (
			<FlatList
				data={this.state.data?.tracks}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				refreshControl={(
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this.reload}
						progressViewOffset={80}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			/>
		);
	}
}

export default withTheme(AlbumScreen);
