import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
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

const styles = StyleSheet.create({
	button: {
		marginLeft: staticTheme.margin
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
				console.error(e);
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
		if (this.state.data?.album.tracks) {
			JamPlayer.playTracks(this.state.data.album.tracks)
				.catch(e => console.error(e));
		}
	};

	private renderHeader = (): JSX.Element => {
		const headerTitleCmds = (
			<>
				<TouchableOpacity style={styles.button} onPress={this.playTracks}>
					<ThemedIcon name="play" style={styles.buttonIcon}/>
				</TouchableOpacity>
				<FavIcon objType={JamObjectType.album} id={this.props.route.params?.id}/>
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

	private keyExtractor = (item: TrackEntry): string => item.entry.id;

	private renderItem = ({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item}/>);

	render(): React.ReactElement {
		return (
			<FlatList
				data={this.state.data?.tracks}
				renderItem={this.renderItem}
				refreshing={this.state.refreshing}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				onRefresh={this.reload}
			/>
		);
	}
}

export default withTheme(AlbumScreen);
