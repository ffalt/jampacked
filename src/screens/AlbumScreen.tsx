import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import ThemedText from '../components/ThemedText';
import {withTheme} from '../style/theming';
import TrackItem from '../components/TrackItem';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import ThemedIcon from '../components/ThemedIcon';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';
import dataService, {AlbumData, TrackEntry} from '../services/data';

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
		data?: AlbumData;
	} = {
		data: undefined
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
		this.setState({data: undefined});
		if (!id) {
			return;
		}
		const data = await dataService.album(id);
		this.setState({data});
	}

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

	render(): JSX.Element {
		return (
			<FlatList
				data={this.state.data?.tracks}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
			/>
		);
	}
}

export default withTheme(AlbumScreen);