import React, {useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {useAuth} from '../services/auth';
import {JamImage} from './JamImage';
import {NavigationService} from '../navigators/navigation';
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
		flexDirection: 'row',
		justifyContent: 'center'
	},
	drawerTilesHeaderText: {
		marginBottom: staticTheme.marginSmall,
		fontSize: staticTheme.fontSizeTiny,
		paddingHorizontal: staticTheme.paddingSmall,
		paddingVertical: 2,
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontWeight: 'bold'
	},
	drawerTile: {
		flexDirection: 'column',
		alignItems: 'center',
		width: 80,
		paddingVertical: staticTheme.padding,
		marginRight: staticTheme.marginSmall,
		marginBottom: staticTheme.marginSmall,
		borderRadius: 4
	},
	drawerTileText: {
		fontSize: staticTheme.fontSizeSmall
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
		<TouchableOpacity style={[styles.drawerTile, {borderColor: theme.separator, backgroundColor: theme.itemBackground}]} onPress={goToRoute}>
			<ThemedIcon name={link.icon} size={18} color={theme.muted}/>
			<ThemedText style={styles.drawerTileText} numberOfLines={1}>{link.title}</ThemedText>
		</TouchableOpacity>
	);
};

const sections = [
	{
		name: 'Jam', items: [
			JamRouteLinks.home(),
			JamRouteLinks.downloads(),
			JamRouteLinks.settings()
		]
	},
	{
		name: 'User', items: [
			JamRouteLinks.user(),
			JamRouteLinks.playlists(),
			JamRouteLinks.bookmarks()
		]
	},
	{
		name: 'Spoken', items: [
			JamRouteLinks.albums(AlbumType.audiobook),
			JamRouteLinks.podcasts(),
			JamRouteLinks.series()
		]
	},
	{
		name: 'Library', items: [
			JamRouteLinks.artists(),
			JamRouteLinks.folders(),
			JamRouteLinks.tracks()
		]
	},
	{
		name: 'Albums', items: [
			JamRouteLinks.albums(AlbumType.album),
			JamRouteLinks.albums(AlbumType.compilation),
			JamRouteLinks.albums(AlbumType.soundtrack),
			JamRouteLinks.albums(AlbumType.live),
			JamRouteLinks.albums(AlbumType.ep),
			JamRouteLinks.albums(AlbumType.single)
		]
	}
];
//
// const routes = [
// 	JamRouteLinks.home()
// ];

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
					<JamImage id={userId} size={staticTheme.userImage} style={styles.userImage}/>
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
				</TouchableOpacity>
				<Separator/>
				{sections.map(section => (
					<View key={section.name}>
						<ThemedText style={styles.drawerTilesHeaderText}>{section.name}</ThemedText>
						<View key={section.name} style={styles.drawerTiles}>
							{section.items.map(link => (
								<AppDrawerLinkTile key={link.title} link={link}/>
							))}
						</View>
					</View>
				))}
				{/*<>*/}
				{/*	{routes.map(link => (*/}
				{/*		<AppDrawerLink key={link.title} link={link}/>*/}
				{/*	))}*/}
				{/*</>*/}
			</SafeAreaView>
		</ScrollView>
	);
};
