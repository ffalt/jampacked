import {CommonActions, NavigationContainerRef} from '@react-navigation/core';
import {JamObjectType} from './jam';
import {HomeRoute} from '../navigators/Routing';
import {Navig} from './types';

let navigator: NavigationContainerRef;

export class NavigationService {

	static setTopLevelNavigator(navigatorRef: NavigationContainerRef): void {
		navigator = navigatorRef;
	}

	static navigate(routeName: string, params: any): void {
		if (navigator) {
			navigator.dispatch(
				CommonActions.navigate({name: routeName, params})
			);
		}
	}

	static navigateLink(link: Navig): void {
		NavigationService.navigate(link.route, link.params);
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
