import {CommonActions, NavigationContainerRef} from '@react-navigation/core';
import {Navig} from './data';

let navigator: NavigationContainerRef;

export default class NavigationService {

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
}
