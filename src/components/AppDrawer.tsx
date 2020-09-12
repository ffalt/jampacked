import React, {useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {useAuth} from '../services/auth';
import {JamImage} from './JamImage';
import {NavigationService} from '../services/navigation';
import {HomeRoute} from '../navigators/Routing';
import {JamUrlType} from '../services/jam-lists';

const styles = StyleSheet.create({
	drawer: {
		flex: 1,
		paddingHorizontal: staticTheme.margin
	},
	drawerHeader: {
		marginVertical: 40,
		alignItems: 'center',
		flexDirection: 'row'
	},
	userImage: {
		marginRight: staticTheme.margin
	},
	drawerRow: {
		flexDirection: 'row',
		height: 35
	},
	drawerRowText: {
		marginLeft: staticTheme.margin,
		fontSize: staticTheme.fontSize
	},
	userHeaderText: {}
});

export const AppDrawerLink: React.FC<{ title: string; icon: string; route: string, params?: any }> =
	({title, icon, route, params}) => {
		const theme = useTheme();
		const goToRoute = useCallback((): void => {
			NavigationService.closeSideBar();
			NavigationService.navigate(route, params || {});
		}, [route, params]);

		return (
			<TouchableOpacity style={[styles.drawerRow, {borderColor: theme.separator}]} onPress={goToRoute}>
				{/*<ThemedIcon name={icon} size={20}/>*/}
				<ThemedText style={styles.drawerRowText}>{title}</ThemedText>
			</TouchableOpacity>
		);
	};

const routes = [
	{route: HomeRoute.START, title: 'Start', icon: 'home'},
	{route: HomeRoute.DOWNLOADS, title: 'Downloads', icon: 'download'},
	{route: HomeRoute.PLAYLISTS, title: 'Playlists', icon: 'playlist'},
	{route: HomeRoute.PODCASTS, title: 'Podcasts', icon: 'podcast'},

	{route: HomeRoute.ARTISTS, title: 'Artists', icon: 'artist'},
	{route: HomeRoute.SERIES, title: 'Series', icon: 'series'},

	{route: HomeRoute.ALBUMS, title: 'Albums', icon: 'album', params: {albumUrlType: JamUrlType.albums}},
	{route: HomeRoute.ALBUMS, title: 'Audiobooks', icon: 'audiobook', params: {albumUrlType: JamUrlType.audiobooks}},
	{route: HomeRoute.ALBUMS, title: 'Singles', icon: 'single', params: {albumUrlType: JamUrlType.singles}},
	{route: HomeRoute.ALBUMS, title: 'EPs', icon: 'ep', params: {albumUrlType: JamUrlType.eps}},
	{route: HomeRoute.ALBUMS, title: 'Bootlegs', icon: 'bootleg', params: {albumUrlType: JamUrlType.bootlegs}},
	{route: HomeRoute.ALBUMS, title: 'Soundtrack', icon: 'soundtrack', params: {albumUrlType: JamUrlType.soundtracks}},
];

export const AppDrawer: React.FC = () => {
	const theme = useTheme();
	const auth = useAuth();
	const userId = auth.currentUserID();
	const userName = auth.currentUserName();

	const goToUser = useCallback((): void => {
		NavigationService.closeSideBar();
		NavigationService.navigate(HomeRoute.USER, {});
	}, []);

	return (
		<ScrollView style={[styles.drawer, {backgroundColor: theme.control}]}>
			<SafeAreaView>
				<TouchableOpacity style={styles.drawerHeader} onPress={goToUser}>
					<JamImage id={userId} size={40} style={styles.userImage}/>
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
				</TouchableOpacity>
				<>
					{routes.map(route => (
						<AppDrawerLink key={route.title} title={route.title} icon={route.icon} route={route.route} params={route.params}/>
					))}
				</>
			</SafeAreaView>
		</ScrollView>
	);
};
