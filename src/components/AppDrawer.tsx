import React, {useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {useAuth} from '../services/auth';
import {JamImage} from './JamImage';
import {NavigationService} from '../services/navigation';
import {HomeRoute} from '../navigators/Routing';
import {Separator} from './Separator';
import {ThemedIcon} from './ThemedIcon';
import {JamRouteLinks, RouteLink} from '../navigators/Routes';
import {AlbumType} from '../services/jam';

const styles = StyleSheet.create({
	drawer: {
		flex: 1,
		paddingHorizontal: staticTheme.margin
	},
	drawerHeader: {
		marginTop: 40,
		marginBottom: staticTheme.margin,
		alignItems: 'center',
		flexDirection: 'row'
	},
	userImage: {
		marginRight: staticTheme.margin
	},
	drawerRow: {
		flexDirection: 'row',
		height: 48,
		alignItems: 'center'
	},
	drawerTiles: {
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	drawerTile: {
		flexDirection: 'column',
		alignItems: 'center',
		width: 70,
		paddingTop: staticTheme.padding,
		marginRight: staticTheme.margin,
		borderRadius: 4,
		backgroundColor: 'rgba(0,0,0,0.2)'
	},
	drawerTileText: {
		fontSize: staticTheme.fontSizeTiny
	},
	drawerRowText: {
		fontSize: staticTheme.fontSize
	},
	iconView: {
		minWidth: staticTheme.fontSize + 4,
		marginRight: staticTheme.margin
	},
	userHeaderText: {}
});

export const AppDrawerLink: React.FC<{ link: RouteLink }> = ({link}) => {
	const theme = useTheme();

	const goToRoute = useCallback((): void => {
		NavigationService.closeSideBar();
		NavigationService.navigate(link.navig.route, link.navig.params);
	}, [link]);

	return (
		<TouchableOpacity style={[styles.drawerRow, {borderColor: theme.separator}]} onPress={goToRoute}>
			<View style={styles.iconView}>
				<ThemedIcon name={link.icon} size={18} color={theme.muted}/>
			</View>
			<ThemedText style={styles.drawerRowText}>{link.title}</ThemedText>
		</TouchableOpacity>
	);
};

export const AppDrawerLinkTile: React.FC<{ link: RouteLink }> = ({link}) => {
	const theme = useTheme();

	const goToRoute = useCallback((): void => {
		NavigationService.closeSideBar();
		NavigationService.navigate(link.navig.route, link.navig.params);
	}, [link]);

	return (
		<TouchableOpacity style={[styles.drawerTile, {borderColor: theme.separator}]} onPress={goToRoute}>
			<ThemedIcon name={link.icon} size={18} color={theme.muted}/>
			<ThemedText style={styles.drawerTileText}>{link.title}</ThemedText>
		</TouchableOpacity>
	);
};

const routes = [
	JamRouteLinks.home(),
	JamRouteLinks.downloads(),
	JamRouteLinks.artists(),
	JamRouteLinks.albums(AlbumType.album),
	JamRouteLinks.folders()
];

const userRoutes = [
	JamRouteLinks.playlists(),
	JamRouteLinks.bookmarks()
];

const spokenRoutes = [
	JamRouteLinks.podcasts(),
	JamRouteLinks.series(),
	JamRouteLinks.albums(AlbumType.audiobook)
];

const tileRoutes = [
	JamRouteLinks.albums(AlbumType.compilation),
	JamRouteLinks.albums(AlbumType.soundtrack),
	JamRouteLinks.albums(AlbumType.ep),
	JamRouteLinks.albums(AlbumType.live),
	JamRouteLinks.albums(AlbumType.single)
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
		<ScrollView style={[styles.drawer, {backgroundColor: theme.sidebar}]}>
			<SafeAreaView>
				<TouchableOpacity style={styles.drawerHeader} onPress={goToUser}>
					<JamImage id={userId} size={40} style={styles.userImage}/>
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
				</TouchableOpacity>
				<Separator/>
				<>
					{routes.map(link => (
						<AppDrawerLink key={link.title} link={link}/>
					))}
				</>
				<View style={styles.drawerTiles}>
					{userRoutes.map(link => (
						<AppDrawerLinkTile key={link.title} link={link}/>
					))}
				</View>
				<View style={styles.drawerTiles}>
					{spokenRoutes.map(link => (
						<AppDrawerLinkTile key={link.title} link={link}/>
					))}
				</View>
				<View style={styles.drawerTiles}>
					{tileRoutes.map(link => (
						<AppDrawerLinkTile key={link.title} link={link}/>
					))}
				</View>

			</SafeAreaView>
		</ScrollView>
	);
};
