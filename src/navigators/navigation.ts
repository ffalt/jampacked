import {CommonActions, DrawerActions, NavigationContainerRef} from '@react-navigation/core';
import {JamObjectType} from '../services/jam';
import {AlbumRoute, AlbumsRoute, ArtistsRoute, FoldersRoute, GenreRoute, GenresRoute, HomeRoute, SeriesRoute, TracksRoute} from './Routing';
import {Navig, NavigParams} from '../services/types';
import {RouteLink} from './Routes';

let navigator: NavigationContainerRef<any>;

export class NavigationService {

	static setTopLevelNavigator(navigatorRef: NavigationContainerRef<any>): void {
		navigator = navigatorRef;
	}

	static closeSideBar(): void {
		if (navigator) {
			navigator.dispatch(
				DrawerActions.closeDrawer()
			);
		}
	}

	static openSideBar(): void {
		if (navigator) {
			navigator.dispatch(
				DrawerActions.openDrawer()
			);
		}
	}

	static navigateToChild(parentRouteName: string, routeName: string, defaultRouteName: string, params?: NavigParams): void {
		if (navigator) {
			navigator.dispatch(
				CommonActions.navigate({
					name: parentRouteName,
					params: {
						...params,
						screen: routeName !== parentRouteName ? routeName : defaultRouteName,
						params
					}
				})
			);
		}
	}

	static navigate(routeName: string, params?: NavigParams): void {
		if (routeName.startsWith('Artists')) {
			this.navigateToChild(HomeRoute.ARTISTS, routeName, ArtistsRoute.INDEX, params);
			return;
		}
		if (routeName.startsWith('Albums')) {
			this.navigateToChild(HomeRoute.ALBUMS, routeName, AlbumsRoute.INDEX, params);
			return;
		}
		if (routeName.startsWith('Album')) {
			this.navigateToChild(HomeRoute.ALBUM, routeName, AlbumRoute.MAIN, params);
			return;
		}
		if (routeName.startsWith('Series')) {
			this.navigateToChild(HomeRoute.SERIES, routeName, SeriesRoute.INDEX, params);
			return;
		}
		if (routeName.startsWith('Folders')) {
			this.navigateToChild(HomeRoute.FOLDERS, routeName, FoldersRoute.INDEX, params);
			return;
		}
		if (routeName.startsWith('Tracks')) {
			this.navigateToChild(HomeRoute.TRACKS, routeName, TracksRoute.FAV, params);
			return;
		}
		if (routeName.startsWith('Genres')) {
			this.navigateToChild(HomeRoute.GENRES, routeName, GenresRoute.INDEX, params);
			return;
		}
		if (routeName.startsWith('Genre')) {
			this.navigateToChild(HomeRoute.GENRE, routeName, GenreRoute.ARTISTS, params);
			return;
		}
		if (navigator) {
			navigator.dispatch(
				CommonActions.navigate({name: routeName, params})
			);
		}
	}

	static navigateTo(navig: Navig): void {
		NavigationService.navigate(navig.route, navig.params);
	}

	static navigateLink(link: RouteLink): void {
		NavigationService.navigateTo(link.navig);
	}

	static routeByObjType(objType: JamObjectType): string | undefined {
		switch (objType) {
			case JamObjectType.album:
				return HomeRoute.ALBUM;
			case JamObjectType.artist:
				return HomeRoute.ARTIST;
			case JamObjectType.folder:
				return HomeRoute.FOLDER;
			case JamObjectType.track:
				return HomeRoute.TRACK;
			case JamObjectType.podcast:
				return HomeRoute.PODCAST;
			case JamObjectType.episode:
				return HomeRoute.EPISODE;
			case JamObjectType.playlist:
				return HomeRoute.PLAYLIST;
			case JamObjectType.series:
				return HomeRoute.SERIE;
			case JamObjectType.genre:
				return HomeRoute.GENRE;
			default:
		}
	}

	static navigateObj(objType: string, id: string, name: string): void {
		const route = NavigationService.routeByObjType(objType as JamObjectType);
		if (route) {
			NavigationService.navigate(route, {id, name});
		}
	}
}
