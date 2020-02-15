import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Subscription} from 'rxjs';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import ThemedText from '../components/ThemedText';
import JamImage from '../components/JamImage';
import {staticTheme, useTheme, withTheme} from '../style/theming';
import Logo from '../components/Logo';
import dataService, {HomeData, HomeEntry, HomeStatData, HomeStatsData} from '../services/data';
import NavigationService from '../services/navigation';
import {snackError} from '../services/snack';

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
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	homeStat: {
		margin: '1%',
		width: '31%',
		alignItems: 'center',
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
	stat: HomeStatData
}

const HomeStat: React.FC<HomeStatProps> = (props: HomeStatProps): JSX.Element => {
	const theme = useTheme();
	const {stat} = props;

	const click = (): void => {
		NavigationService.navigateLink(stat.link);
	};

	return (
		<TouchableOpacity onPress={click} style={[styles.homeStat, {backgroundColor: theme.itemBackground}]}>
			<ThemedText style={styles.homeStatValue}>{stat.value}</ThemedText>
			<ThemedText style={styles.homeStatDesc}>{stat.text}</ThemedText>
		</TouchableOpacity>
	);
};

interface HomeStatsProps {
	stats: Array<HomeStatData>;
}

const HomeStats: React.FC<HomeStatsProps> = (props: HomeStatsProps): JSX.Element => {
	const {stats} = props;
	const entries = stats && stats.length > 0
		? stats.map(stat => <HomeStat key={stat.text} stat={stat}/>)
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
	const {entry} = props;

	const click = (): void => {
		NavigationService.navigate(entry.route, {id: entry.obj.id, name: entry.obj.name});
	};

	return (
		<TouchableOpacity onPress={click}>
			<View style={[styles.HomeSectionEntry, {backgroundColor: theme.itemBackground}]}>
				<JamImage id={entry.obj.id} size={80}/>
				<ThemedText numberOfLines={1} style={styles.HomeSectionEntryText}>{entry.obj.name}</ThemedText>
			</View>
		</TouchableOpacity>
	);
};

interface HomeSectionProps {
	title: string;
	section?: Array<HomeEntry>;
}

const HomeSection: React.FC<HomeSectionProps> = (props: HomeSectionProps): JSX.Element => {
	const {section, title} = props;
	if (!section || section.length === 0) {
		return (<></>);
	}
	const entries = section.map(entry => <HomeSectionEntry key={entry.obj.id} entry={entry}/>);
	return (
		<View>
			<ThemedText style={styles.headline}>{title}</ThemedText>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{entries}
			</ScrollView>
		</View>
	);
};

const WelcomeSection: React.FC = (): JSX.Element => {
	const name = `Welcome, ${dataService.currentUserName}`;
	const id = dataService.currentUserID;
	return (
		<View style={styles.userHeader}>
			<Logo size={40}/>
			<ThemedText style={styles.userHeaderText}>{name}</ThemedText>
			<JamImage id={id} size={40} style={styles.userImage}/>
		</View>
	);
};

class HomeScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.START>> {
	state: {
		data?: HomeData;
		stats: HomeStatsData;
		refreshing: boolean;
	} = {
		data: undefined,
		refreshing: false,
		stats: []
	};
	homeDataSubscription?: Subscription;

	componentDidMount(): void {
		this.homeDataSubscription = dataService.homeData.subscribe(data => {
			this.setState({data});
		});
		this.load();
	}

	componentWillUnmount(): void {
		if (this.homeDataSubscription) {
			this.homeDataSubscription.unsubscribe();
		}
	}

	private load(forceRefresh: boolean = false): void {
		this.setState({refreshing: true});
		let statsLoading: boolean = true;
		let homeLoading: boolean = true;

		dataService.stats(forceRefresh)
			.then((stats) => {
				this.setState({stats});
			})
			.catch(e => {
				snackError(e);
			})
			.finally(() => {
				statsLoading = false;
				this.setState({refreshing: statsLoading || homeLoading});
			});

		const {data} = this.state;
		if (forceRefresh || !data) {
			dataService.refreshHomeData()
				.catch(e => {
					snackError(e);
				})
				.finally(() => {
					homeLoading = false;
					this.setState({refreshing: statsLoading || homeLoading});
				});
		} else {
			homeLoading = false;
			this.setState({refreshing: statsLoading || homeLoading});
		}
	}

	private reload = (): void => {
		this.load(true);
	};

	render(): React.ReactElement {
		const {theme} = this.props;
		const {data, refreshing, stats} = this.state;
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
				<View style={styles.container}>
					<WelcomeSection/>
					<HomeStats stats={stats}/>
					<HomeSection title="Recently Played Albums" section={data?.albumsRecent}/>
					<HomeSection title="Recently Played Artists" section={data?.artistsRecent}/>
					<HomeSection title="Favourite Albums" section={data?.albumsFaved}/>
					<HomeSection title="Favourite Artists" section={data?.artistsFaved}/>
				</View>
			</ScrollView>
		);
	}
}

export default withTheme(HomeScreen);
