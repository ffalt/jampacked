import {CommonActions, DrawerActions, NavigationContainerRef} from '@react-navigation/core';
import {JamObjectType} from '../services/jam';
import {AlbumsRoute, HomeRoute} from './Routing';
import {Navig, NavigParams} from '../services/types';
import {RouteLink} from './Routes';

let navigator: NavigationContainerRef;

export class NavigationService {

	static setTopLevelNavigator(navigatorRef: NavigationContainerRef): void {
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

	static navigate(routeName: string, params?: NavigParams): void {
		if (navigator) {
			console.log('go', routeName, params);
			if (routeName.startsWith('Artists') && routeName !== HomeRoute.ARTISTS) {
				navigator.dispatch(
					CommonActions.navigate({
						name: HomeRoute.ARTISTS,
						params: {
							screen: routeName,
							params
						}
					})
				);
				return;
			}
			if (routeName.startsWith('Albums')) {
				navigator.dispatch(
					CommonActions.navigate({
						name: HomeRoute.ALBUMS,
						params: {
							...params,
							screen: routeName !== HomeRoute.ALBUMS ? routeName : AlbumsRoute.INDEX,
							params
						}
					})
				);
				return;
			}
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
				return HomeRoute.SERIESITEM;
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
