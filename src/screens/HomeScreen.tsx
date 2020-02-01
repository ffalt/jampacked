import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import jam from '../services/jamapi';
import {AlbumType, Jam} from '../services/jam';
import ThemedText from '../components/ThemedText';
import {getTypeByAlbumType} from '../services/jam-lists';
import JamImage from '../components/JamImage';
import {staticTheme, useTheme} from '../style/theming';
import Logo from '../components/Logo';

export interface HomeEntry {
	obj: Jam.Base;

	click(): void;
}

const styles = StyleSheet.create({
	container: {
		padding: staticTheme.padding,
		marginTop: staticTheme.statusBarOffset
	},
	userHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: staticTheme.padding
	},
	userHeaderText: {
		fontSize: staticTheme.fontSizeLarge
	},
	homeStatContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	homeStat: {
		width: 120,
		alignItems: 'center',
		marginRight: staticTheme.margin,
		marginBottom: staticTheme.margin,
		padding: staticTheme.padding,
		borderRadius: 4
	},
	homeStatValue: {
		fontWeight: 'bold',
		fontSize: staticTheme.fontSizeLarge
	},
	homeStatDesc: {
		fontSize: staticTheme.fontSizeSmall
	},
	HomeSectionEntryText: {
		fontSize: staticTheme.fontSizeSmall,
		marginTop: staticTheme.marginSmall,
		marginBottom: staticTheme.marginSmall
	},
	HomeSectionEntry: {
		width: 120,
		paddingTop: staticTheme.padding,
		marginRight: staticTheme.margin,
		alignItems: 'center',
		borderRadius: 4,
		backgroundColor: 'rgba(0,0,0,0.2)'
	},
	headline: {
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeSmall,
		fontWeight: 'bold',
		padding: staticTheme.padding,
		marginTop: staticTheme.margin
	},
	userImage: {
		borderRadius: 20
	}
});

interface HomeStatProps {
	stat: { text: string, click: () => void, value: number }
}

const HomeStat: React.FC<HomeStatProps> = (props: HomeStatProps): JSX.Element => {
	const theme = useTheme();

	const click = (): void => {
		props.stat.click();
	};

	return (
		<TouchableOpacity onPress={click}>
			<View style={[styles.homeStat, {backgroundColor: theme.itemBackground}]}>
				<ThemedText style={styles.homeStatValue}>{props.stat.value}</ThemedText>
				<ThemedText style={styles.homeStatDesc}>{props.stat.text}</ThemedText>
			</View>
		</TouchableOpacity>
	);
};

interface HomeStatsProps {
	stats: Array<{ text: string, click: () => void, value: number }>;
}

const HomeStats: React.FC<HomeStatsProps> = (props: HomeStatsProps): JSX.Element => {
	const entries = props.stats && props.stats.length > 0
		? props.stats.map(stat => <HomeStat key={stat.text} stat={stat}/>)
		: [];
	return (
		<>
			<ThemedText style={styles.headline}>Library</ThemedText>
			<View style={styles.homeStatContainer}>{entries}</View>
		</>
	);
};

interface HomeSectionEntryProps {
	entry: HomeEntry;
}

const HomeSectionEntry: React.FC<HomeSectionEntryProps> = (props: HomeSectionEntryProps): JSX.Element => {
	const theme = useTheme();

	const click = (): void => {
		props.entry.click();
	};

	return (
		<TouchableOpacity onPress={click}>
			<View style={[styles.HomeSectionEntry, {backgroundColor: theme.itemBackground}]}>
				<JamImage id={props.entry.obj.id} size={80}/>
				<ThemedText numberOfLines={1} style={styles.HomeSectionEntryText}>{props.entry.obj.name}</ThemedText>
			</View>
		</TouchableOpacity>
	);
};

interface HomeSectionProps {
	title: string;
	section?: Array<HomeEntry>;
}

const HomeSection: React.FC<HomeSectionProps> = (props: HomeSectionProps): JSX.Element => {
	if (!props.section || props.section.length === 0) {
		return (<></>);
	}
	const entries = props.section.map(entry => <HomeSectionEntry key={entry.obj.id} entry={entry}/>);
	return (
		<View>
			<ThemedText style={styles.headline}>{props.title}</ThemedText>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{entries}
			</ScrollView>
		</View>
	);
};

const WelcomeSection: React.FC = (): JSX.Element => {
	const name = `Welcome, ${jam.auth?.user?.name}`;
	return (
		<View style={styles.userHeader}>
			<Logo size={40}/>
			<ThemedText style={styles.userHeaderText}>{name}</ThemedText>
			<JamImage id={jam.auth?.user?.id || ''} size={40} style={styles.userImage}/>
		</View>
	);
};

class HomeScreen extends React.PureComponent<HomeStackProps<HomeRoute.START>> {
	state: {
		artist_recent?: Array<HomeEntry>;
		artist_faved?: Array<HomeEntry>;
		album_faved?: Array<HomeEntry>;
		album_recent?: Array<HomeEntry>;
		stats: Array<{ text: string, click: () => void, value: number }>;
	} = {
		stats: []
	};

	componentDidMount(): void {
		jam.artist.list({list: 'recent', amount: 5})
			.then(data => {
				const artist_recent = data.items.map(obj => ({
					obj,
					click: (): void => {
						this.goToArtist(obj.id, obj.name);
					}
				}));
				this.setState({artist_recent});
			})
			.catch(e => {
				console.error(e);
			});
		jam.artist.list({list: 'faved', amount: 5})
			.then(data => {
				const artist_faved = data.items.map(obj => ({
					obj,
					click: (): void => this.goToArtist(obj.id, obj.name)
				}));
				this.setState({artist_faved});
			})
			.catch(e => {
				console.error(e);
			});
		jam.album.list({list: 'faved', amount: 5})
			.then(data => {
				const album_faved = data.items.map(obj => ({
					obj,
					click: (): void => this.goToAlbum(obj.id, obj.name)
				}));
				this.setState({album_faved});
			})
			.catch(e => {
				console.error(e);
			});
		jam.album.list({list: 'recent', amount: 5})
			.then(data => {
				const album_recent = data.items.map(obj => ({
					obj,
					click: (): void => this.goToAlbum(obj.id, obj.name)
				}));
				this.setState({album_recent});
			})
			.catch(e => {
				console.error(e);
			});

		jam.various.stats({})
			.then(stat => {
				const stats = [
					{text: 'Artists', click: (): void => this.goToArtists(), value: stat.artistTypes.album},
					...[
						{type: getTypeByAlbumType(AlbumType.album), value: stat.albumTypes.album},
						{type: getTypeByAlbumType(AlbumType.compilation), value: stat.albumTypes.compilation}
					].map(t => ({
						text: t.type?.text, click: (): void => this.goToAlbums(t.type?.id || ''), value: t.value
					})),
					{text: 'Series', click: (): void => this.goToSeries(), value: stat.series},
					...[
						{type: getTypeByAlbumType(AlbumType.audiobook), value: stat.albumTypes.audiobook},
						{type: getTypeByAlbumType(AlbumType.soundtrack), value: stat.albumTypes.soundtrack},
						{type: getTypeByAlbumType(AlbumType.live), value: stat.albumTypes.live},
						{type: getTypeByAlbumType(AlbumType.bootleg), value: stat.albumTypes.bootleg},
						{type: getTypeByAlbumType(AlbumType.ep), value: stat.albumTypes.ep},
						{type: getTypeByAlbumType(AlbumType.single), value: stat.albumTypes.single}
					].map(t => ({
						text: t.type?.text, click: (): void => this.goToAlbums(t.type?.id || ''), value: t.value
					})),
					{
						text: 'Folders',
						click: (): void => this.goToFolders(),
						value: stat.folder
					},
					{
						text: 'Tracks',
						click: (): void => this.goToTracks(),
						value: stat.track
					}
				].filter(t => t.value > 0);
				this.setState({stats});
			})
			.catch(e => {
				console.error(e);
			});
	}

	goToArtist(id: string, name: string): void {
		this.props.navigation.navigate(HomeRoute.ARTIST, {id, name});
	}

	goToAlbums(albumTypeID: string): void {
		this.props.navigation.navigate(HomeRoute.ALBUMS, {albumTypeID});
	}

	goToAlbum(id: string, name: string): void {
		this.props.navigation.navigate(HomeRoute.ALBUM, {id, name});
	}

	goToFolders(): void {
		// this.props.navigation.navigate(HomeRoute.FOLDERS);
	}

	goToTracks(): void {
		// this.props.navigation.navigate(HomeRoute.TRACK);
	}

	goToArtists(): void {
		this.props.navigation.navigate(HomeRoute.ARTISTS);
	}

	goToSeries(): void {
		this.props.navigation.navigate(HomeRoute.SERIES);
	}

	render(): JSX.Element {
		return (
			<ScrollView>
				<View style={styles.container}>
					<WelcomeSection/>
					<HomeStats stats={this.state.stats}/>
					<HomeSection title="Recently Played Albums" section={this.state.album_recent}/>
					<HomeSection title="Recently Played Artists" section={this.state.artist_recent}/>
					<HomeSection title="Favourite Albums" section={this.state.album_faved}/>
					<HomeSection title="Favourite Artists" section={this.state.artist_faved}/>
				</View>
			</ScrollView>
		);
	}
}

export default HomeScreen;
