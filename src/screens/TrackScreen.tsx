import React from 'react';
import {RefreshControl, ScrollView, TouchableOpacity, View} from 'react-native';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import ObjHeader, {HeaderDetail, objHeaderStyles} from '../components/ObjHeader';
import dataService, {TrackEntry} from '../services/data';
import {genreDisplay} from '../utils/genre.utils';
import {snackError} from '../services/snack';
import {JamPlayer} from '../services/player';
import {JamObjectType} from '../services/jam';
import ThemedIcon from '../components/ThemedIcon';
import FavIcon from '../components/FavIcon';
import Lyrics from '../components/Lyrics';
import {withTheme} from '../style/theming';

class TrackScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.TRACK>> {
	state: {
		data?: TrackEntry;
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
		const newProps = this.props;
		if (prevProps.route.params?.id !== newProps.route.params?.id) {
			this.setState({data: undefined, details: this.buildDetails()});
			this.load();
		}
	}

	private buildDetails(artist?: string, album?: string, genre?: string): Array<HeaderDetail> {
		return [
			{title: 'Artist', value: artist || ''},
			{title: 'Album', value: `${album || ''}`},
			{title: 'Genre', value: genre || ''}
		];
	}

	private load(forceRefresh: boolean = false): void {
		const {route} = this.props;
		const {id} = route.params;
		if (!id) {
			return;
		}
		this.setState({refreshing: true});
		dataService.track(id, forceRefresh)
			.then(data => {
				const details = this.buildDetails(data.artist, data.album, data.genre ? genreDisplay([data.genre]) : undefined);
				this.setState({data, details, refreshing: false});
			})
			.catch(e => {
				this.setState({refreshing: false});
				snackError(e);
			});
	}

	private playTrack = (): void => {
		const {data} = this.state;
		if (data) {
			JamPlayer.playTrack(data)
				.catch(e => console.error(e));
		}
	};

	private reload = (): void => {
		this.load(true);
	};

	render(): React.ReactElement {
		const {route, theme} = this.props;
		const {refreshing, details} = this.state;
		const {id, name} = route.params;
		const headerTitleCmds = (
			<>
				<TouchableOpacity style={objHeaderStyles.button} onPress={this.playTrack}>
					<ThemedIcon name="play" style={objHeaderStyles.buttonIcon}/>
				</TouchableOpacity>
				<FavIcon style={objHeaderStyles.button} objType={JamObjectType.track} id={id}/>
			</>
		);
		return (
			<ScrollView
				refreshControl={(
					<RefreshControl
						refreshing={refreshing}
						onRefresh={this.reload}
						progressViewOffset={70}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			>
				<View>
					<ObjHeader
						id={id}
						title={name}
						typeName="Track"
						details={details}
						headerTitleCmds={headerTitleCmds}
					/>
					<Lyrics id={id}/>
				</View>
			</ScrollView>
		);
	}
}

export default withTheme(TrackScreen);
