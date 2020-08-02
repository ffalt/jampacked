import React, {useCallback, useEffect} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {ThemedText} from '../components/ThemedText';
import {JamImage} from '../components/JamImage';
import {staticTheme, useTheme} from '../style/theming';
import {Logo} from '../components/Logo';
import {HomeStats} from '../components/HomeStats';
import {HomeDataSection} from '../components/HomeDataSection';
import {useLazyHomeDataQuery} from '../services/queries/home';
import {snackError} from '../services/snack';
import {useAuth} from '../services/auth';

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

export const HomeScreen: React.FC<HomeStackProps<HomeRoute.START>> = () => {
	const theme = useTheme();
	const auth = useAuth();
	const [getHomeData, {loading, error, called, homeData}] = useLazyHomeDataQuery();

	useEffect(() => {
		if (!called) {
			getHomeData();
		}
	}, [getHomeData, called]);

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		getHomeData(true);
	}, [getHomeData]);

	const userName = `Welcome, ${auth.currentUserName()}`;
	const userId = auth.currentUserID();

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
					<Logo size={40}/>
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
					<JamImage id={userId} size={40} style={styles.userImage}/>
				</View>
				<HomeStats stats={homeData?.stats}/>
				<HomeDataSection homeData={homeData?.homeData}/>
			</View>
		</ScrollView>
	);
};

