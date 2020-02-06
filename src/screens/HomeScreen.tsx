import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Subscription} from 'rxjs';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import ThemedText from '../components/ThemedText';
import JamImage from '../components/JamImage';
import {staticTheme, useTheme} from '../style/theming';
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
	stat: HomeStatData
}

const HomeStat: React.FC<HomeStatProps> = (props: HomeStatProps): JSX.Element => {
	const theme = useTheme();

	const click = (): void => {
		NavigationService.navigateLink(props.stat.link);
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
	stats: Array<HomeStatData>;
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
		NavigationService.navigate(props.entry.route, {id: props.entry.obj.id, name: props.entry.obj.name});
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

class HomeScreen extends React.PureComponent<HomeStackProps<HomeRoute.START>> {
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


		if (forceRefresh || !this.state.data) {
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
		return (
			<ScrollView
				refreshControl={
					(
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.reload}
						/>
					)
				}
			>
				<View style={styles.container}>
					<WelcomeSection/>
					<HomeStats stats={this.state.stats}/>
					<HomeSection title="Recently Played Albums" section={this.state.data?.albumsRecent}/>
					<HomeSection title="Recently Played Artists" section={this.state.data?.artistsRecent}/>
					<HomeSection title="Favourite Albums" section={this.state.data?.albumsFaved}/>
					<HomeSection title="Favourite Artists" section={this.state.data?.artistsFaved}/>
				</View>
			</ScrollView>
		);
	}
}

export default HomeScreen;
