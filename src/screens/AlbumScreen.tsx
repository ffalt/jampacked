import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import ThemedText from '../components/ThemedText';
import {Jam} from '../services/jam';
import jam from '../services/jamapi';
import {withTheme} from '../style/theming';
import TrackItem from '../components/TrackItem';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import ThemedIcon from '../components/ThemedIcon';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';

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

class AlbumScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ALBUM>> {
	state: {
		album: Jam.Album | undefined;
		tracks: Array<Jam.Track>;
	} = {
		album: undefined,
		tracks: []
	};

	componentDidMount(): void {
		this.load(this.props.route.params.id)
			.catch(e => console.error(e));
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.load(this.props.route.params.id)
				.catch(e => console.error(e));
		}
	}

	private async load(id: string): Promise<void> {
		if (!id) {
			return;
		}
		const album = await jam.album.id({id, albumTracks: true, trackTag: true});
		this.setState({album, tracks: album.tracks});
	}

	private toArtist = (): void => {
		if (this.state.album && this.state.album.artistID) {
			this.props.navigation.navigate(HomeRoute.ARTIST, {id: this.state.album.artistID, name: this.state.album.artist || ''});
		}
	};

	private playTracks = (): void => {
		JamPlayer.playTracks(this.state.tracks)
			.catch(e => console.error(e));
	};

	private renderHeader = (): JSX.Element => {
		const headerTitleCmds = (
			<TouchableOpacity
				style={[styles.playButton, {borderColor: this.props.theme.textColor}]}
				onPress={this.playTracks}
			>
				<ThemedIcon name="play" style={styles.playButtonIcon}/>
			</TouchableOpacity>
		);

		return (
			<ObjHeader
				id={this.props.route?.params?.id}
				title={this.props.route?.params?.name}
				headerTitleCmds={headerTitleCmds}
			>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Artist</ThemedText>
				<TouchableOpacity onPress={this.toArtist}>
					<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.album?.artist}</ThemedText>
				</TouchableOpacity>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Tracks</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.album?.trackCount}</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Genre</ThemedText>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{genreDisplay(this.state.album?.genres)}</ThemedText>
			</ObjHeader>
		);
	};

	private keyExtractor = (item: Jam.Track): string => item.id;

	private renderItem = ({item}: { item: Jam.Track }): JSX.Element => (<TrackItem track={item}/>);

	render(): JSX.Element {
		return (
			<FlatList
				data={this.state.tracks}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
			/>
		);
	}
}

export default withTheme(AlbumScreen);
