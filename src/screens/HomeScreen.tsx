import React, {useCallback, useEffect} from 'react';
import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {ThemedText} from '../components/ThemedText';
import {JamImage} from '../components/JamImage';
import {staticTheme, useTheme} from '../style/theming';
import {Logo} from '../components/Logo';
import {Stats} from '../components/Stats';
import {HomeDataSection} from '../components/HomeDataSection';
import {useAuth} from '../services/auth';
import dataService from '../services/data';
import {NavigationService} from '../navigators/navigation';
import {ErrorView} from '../components/ErrorView';
import {useLazyHomeDataQuery} from '../services/queries/home.hook';

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
		paddingLeft: staticTheme.padding,
		paddingRight: staticTheme.padding,
		fontSize: staticTheme.fontSizeLarge,
		textAlign: 'center',
		flex: 1,
		flexWrap: 'wrap'
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

export const HomeScreen: React.FC<HomeRouteProps<HomeRoute.START>> = () => {
	const theme = useTheme();
	const auth = useAuth();
	const [getHomeData, {loading, error, called, homeData}] = useLazyHomeDataQuery();

	useEffect(() => {
		if (!called) {
			getHomeData();
		}
	}, [getHomeData, called]);

	useEffect(() => {
		const subscription = dataService.homeDataUpdate.subscribe(() => {
			getHomeData();
		});
		return (): void => subscription.unsubscribe();
	}, [getHomeData]);

	const reload = useCallback((): void => {
		getHomeData(true);
	}, [getHomeData]);

	const goToUser = useCallback((): void => {
		NavigationService.navigate(HomeRoute.USER, {});
	}, []);

	const userName = `Welcome, ${auth.currentUserName()}`;
	const userId = auth.currentUserID();

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<ScrollView
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={70}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		>
			<View style={styles.container}>
				<View style={styles.userHeader}>
					<TouchableOpacity onPress={NavigationService.openSideBar}>
						<Logo size={staticTheme.userImage}/>
					</TouchableOpacity>
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
					<TouchableOpacity onPress={goToUser}>
						<JamImage id={userId} size={staticTheme.userImage} style={styles.userImage}/>
					</TouchableOpacity>
				</View>
				<Stats stats={homeData?.stats} label="Library"/>
				<HomeDataSection homeData={homeData?.homeData}/>
			</View>
		</ScrollView>
	);
};

