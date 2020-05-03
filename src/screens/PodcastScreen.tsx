import React from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {withTheme} from '../style/theming';
import TrackItem, {trackEntryHeight} from '../components/TrackItem';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import {JamPlayer} from '../services/player';
import ThemedIcon from '../components/ThemedIcon';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import Separator from '../components/Separator';
import dataService, {PodcastData, TrackEntry} from '../services/data';
import {JamObjectType} from '../services/jam';
import FavIcon from '../components/FavIcon';
import {snackError} from '../services/snack';
import {commonItemLayout} from '../components/AtoZList';
import PopupMenu, {PopupMenuAction, PopupMenuRef} from '../components/PopupMenu';
import NavigationService from '../services/navigation';
import ThemedText from '../components/ThemedText';

class PodcastScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.PODCAST>> {
	state: {
		data?: PodcastData;
		refreshing: boolean;
		popupMenuActions: Array<PopupMenuAction>;
	} = {
		refreshing: false,
		data: undefined,
		popupMenuActions: []
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		const newProps = this.props;
		if (prevProps.route.params?.id !== newProps.route.params?.id) {
			this.setState({data: undefined});
			this.load();
		}
	}

	private load(forceRefresh: boolean = false): void {
		const {route} = this.props;
		const {id} = route.params;
		if (!id) {
			return;
		}
		this.setState({refreshing: true});
		dataService.podcast(id, forceRefresh)
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

	private playTracks = (): void => {
		const {data} = this.state;
		if (data?.episodes) {
			JamPlayer.playTracks(data.episodes)
				.catch(e => {
					snackError(e);
				});
		}
	};

	private renderHeader = (): JSX.Element => {
		const {route} = this.props;
		const {id, name} = route?.params;
		const {data} = this.state;
		const headerTitleCmds = (
			<>
				<TouchableOpacity style={objHeaderStyles.button} onPress={this.playTracks}>
					<ThemedIcon name="play" style={objHeaderStyles.buttonIcon}/>
				</TouchableOpacity>
				<FavIcon style={objHeaderStyles.button} objType={JamObjectType.podcast} id={id}/>
			</>
		);
		const customDetails = (
			<ThemedText style={objHeaderStyles.panel}>{data?.podcast?.description}</ThemedText>
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
	};

	private keyExtractor = (item: TrackEntry): string => item.id;

	private menuRef: PopupMenuRef = React.createRef();
	private showMenu = (ref: React.RefObject<any>, item: TrackEntry): void => {
		const popupMenuActions = [
			{
				title: 'Play Episode',
				click: (): void => {
					JamPlayer.playTrack(item)
						.catch(e => console.error(e));
				}
			},
			{
				title: 'Add Episodes to Queue',
				click: (): void => {
					JamPlayer.addTrackToQueue(item)
						.catch(e => console.error(e));
				}
			},
			{
				title: 'Add Episodes from here to Queue',
				click: (): void => {
					const {data} = this.state;
					const tracks = data?.episodes || [];
					const index = tracks.indexOf(item);
					if (index >= 0) {
						JamPlayer.addTracksToQueue(tracks.slice(index))
							.catch(e => console.error(e));
					}
				}
			},
			{
				title: 'Open Episode Profile',
				click: (): void => {
					NavigationService.navigateObj(JamObjectType.episode, item.id, item.title);
				}
			}
		];
		this.setState({popupMenuActions});
		if (this.menuRef.current) {
			this.menuRef.current.showMenu(ref);
		}
	};
	private renderItem = ({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item} showMenu={this.showMenu}/>);

	private getItemLayout = commonItemLayout(trackEntryHeight);

	render(): React.ReactElement {
		const {theme} = this.props;
		const {data, refreshing, popupMenuActions} = this.state;
		return (
			<>
				<PopupMenu ref={this.menuRef} actions={popupMenuActions}/>
				<FlatList
					data={data?.episodes}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
					ItemSeparatorComponent={Separator}
					ListHeaderComponent={this.renderHeader}
					getItemLayout={this.getItemLayout}
					refreshControl={(
						<RefreshControl
							refreshing={refreshing}
							onRefresh={this.reload}
							progressViewOffset={80}
							progressBackgroundColor={theme.refreshCtrlBackground}
							colors={theme.refreshCtrlColors}
						/>
					)}
				/>
			</>
		);
	}
}

export default withTheme(PodcastScreen);
