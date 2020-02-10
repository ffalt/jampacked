import React from 'react';
import {FlatList, RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';
import ThemedText from '../components/ThemedText';
import {staticTheme, withTheme} from '../style/theming';
import TrackItem from '../components/TrackItem';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import ThemedIcon from '../components/ThemedIcon';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';
import dataService, {AlbumData, TrackEntry} from '../services/data';
import {JamObjectType} from '../services/jam';
import FavIcon from '../components/FavIcon';
import {snackError} from '../services/snack';

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: staticTheme.paddingSmall,
		marginHorizontal: staticTheme.marginLarge
	},
	buttonIcon: {
		fontSize: 26
	}
});

class AlbumScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ALBUM>> {
	state: {
		data?: AlbumData;
		refreshing: boolean;
	} = {
		refreshing: false,
		data: undefined
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.setState({data: undefined});
			this.load();
		}
	}

	private load(forceRefresh: boolean = false): void {
		const {id} = this.props.route.params;
		if (!id) {
			return;
		}
		this.setState({refreshing: true});
		dataService.album(id, forceRefresh)
			.then(data => {
				this.setState({data, refreshing: false});
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
				<TouchableOpacity style={styles.button} onPress={this.playTracks}>
					<ThemedIcon name="play" style={styles.buttonIcon}/>
				</TouchableOpacity>
				<FavIcon style={styles.button} objType={JamObjectType.album} id={this.props.route.params?.id}/>
			</>
		);

		return (
			<ObjHeader
				id={this.props.route?.params?.id}
				title={this.props.route?.params?.name}
				headerTitleCmds={headerTitleCmds}
			>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Artist</ThemedText>
				<TouchableOpacity onPress={this.toArtist}>
					<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.album.artist}</ThemedText>
				</TouchableOpacity>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Tracks</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.album.trackCount}</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Genre</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{genreDisplay(this.state.data?.album.genres)}</ThemedText>
			</ObjHeader>
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
