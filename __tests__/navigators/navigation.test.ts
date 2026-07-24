import { describe, it, expect } from '@jest/globals';
import { NavigationService } from '../../src/navigators/navigation';
import { HomeRoute } from '../../src/navigators/Routing';
import { JamObjectType } from '../../src/services/jam';

interface Action {
	action: string;
	route?: string;
	params?: unknown;
}

const mockNavigate = jest.fn((route: string, parameters?: unknown): Action => ({ action: 'navigate', route, params: parameters }));
const mockGoBack = jest.fn((): Action => ({ action: 'goBack' }));

jest.mock('@react-navigation/core', () => ({
	CommonActions: {
		navigate: (route: string, parameters?: unknown): Action => mockNavigate(route, parameters),
		goBack: (): Action => mockGoBack()
	}
}));

const mockDispatch = jest.fn();

describe('NavigationService', () => {
	beforeEach(() => {
		NavigationService.setTopLevelNavigator({ dispatch: mockDispatch } as never);
	});

	it('navigate dispatches to the navigation ref', () => {
		NavigationService.navigate('Player', { id: 'x' });
		expect(mockDispatch).toHaveBeenCalledWith({ action: 'navigate', route: 'Player', params: { id: 'x' } });
	});

	it('navigateTo forwards a RouteLink navig (route + params)', () => {
		NavigationService.navigateTo({ route: 'Player', params: { id: 'y' } });
		expect(mockDispatch).toHaveBeenCalledWith({ action: 'navigate', route: 'Player', params: { id: 'y' } });
	});

	it('navigateObj maps an object type to its route and navigates', () => {
		NavigationService.navigateObj(JamObjectType.playlist, 'p1', 'My Playlist');
		expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
			action: 'navigate',
			route: 'Main',
			params: expect.objectContaining({
				screen: 'Home',
				params: { screen: HomeRoute.PLAYLIST, params: { id: 'p1', name: 'My Playlist' } }
			})
		}));
	});

	it('routeByObjType maps each JamObjectType to the correct route', () => {
		expect(NavigationService.routeByObjType(JamObjectType.album)).toBe(HomeRoute.ALBUM);
		expect(NavigationService.routeByObjType(JamObjectType.artist)).toBe(HomeRoute.ARTIST);
		expect(NavigationService.routeByObjType(JamObjectType.folder)).toBe(HomeRoute.FOLDER);
		expect(NavigationService.routeByObjType(JamObjectType.track)).toBe(HomeRoute.TRACK);
		expect(NavigationService.routeByObjType(JamObjectType.podcast)).toBe(HomeRoute.PODCAST);
		expect(NavigationService.routeByObjType(JamObjectType.episode)).toBe(HomeRoute.EPISODE);
		expect(NavigationService.routeByObjType(JamObjectType.playlist)).toBe(HomeRoute.PLAYLIST);
		expect(NavigationService.routeByObjType(JamObjectType.series)).toBe(HomeRoute.SERIE);
		expect(NavigationService.routeByObjType(JamObjectType.genre)).toBe(HomeRoute.GENRE);
	});

	it('navigateToChild / navigateToHomeScreen route into the home stack', () => {
		NavigationService.navigateToHomeScreen('Bookmarks', { id: 'b' });
		expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
			action: 'navigate',
			route: 'Main',
			params: { screen: 'Home', params: { screen: 'Bookmarks', params: { id: 'b' } } }
		}));

		mockDispatch.mockClear();
		NavigationService.navigateToChild('Artists', 'ArtistsFav', 'ArtistsIndex', { id: 'c' });
		const action = (mockDispatch.mock.calls as Array<Array<Action>>)[0][0];
		expect(action.route).toBe('Main');
		const outer = action.params as { screen: string; params: { screen: string } };
		expect(outer.screen).toBe('Home');
		expect(outer.params.screen).toBe('Artists');
	});

	it('goBack dispatches a back action', () => {
		NavigationService.goBack();
		expect(mockDispatch).toHaveBeenCalledWith({ action: 'goBack' });
	});
});
