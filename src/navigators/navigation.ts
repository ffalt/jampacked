import { CommonActions, NavigationContainerRef } from '@react-navigation/core';
import { JamObjectType } from '../services/jam';
import { AlbumRoute, AlbumsRoute, ArtistsRoute, FoldersRoute, GenreRoute, GenresRoute, HomeRoute, SeriesRoute, TracksRoute } from './Routing';
import { RouteLink } from './Routes';
import { Navig, NavigParameters } from '../types/navig.ts';

let navigator: NavigationContainerRef<ReactNavigation.RootParamList>;

export const NavigationService = {
	setTopLevelNavigator(navigatorReference: NavigationContainerRef<ReactNavigation.RootParamList> | null): void {
		navigator = navigatorReference!;
	},

	navigateToChild(parentRouteName: string, routeName: string, defaultRouteName: string, parameters?: NavigParameters): void {
		if (navigator) {
			navigator.dispatch(
				CommonActions.navigate({
					name: parentRouteName,
					params: {
						...parameters,
						screen: routeName === parentRouteName ? defaultRouteName : routeName,
						params: parameters
					}
				})
			);
		}
	},

	navigate(routeName: string, parameters?: NavigParameters): void {
		if (routeName.startsWith('Artists')) {
			this.navigateToChild(HomeRoute.ARTISTS, routeName, ArtistsRoute.INDEX, parameters);
			return;
		}
		if (routeName.startsWith('Albums')) {
			this.navigateToChild(HomeRoute.ALBUMS, routeName, AlbumsRoute.INDEX, parameters);
			return;
		}
		if (routeName.startsWith('Album')) {
			this.navigateToChild(HomeRoute.ALBUM, routeName, AlbumRoute.MAIN, parameters);
			return;
		}
		if (routeName.startsWith('Series')) {
			this.navigateToChild(HomeRoute.SERIES, routeName, SeriesRoute.INDEX, parameters);
			return;
		}
		if (routeName.startsWith('Folders')) {
			this.navigateToChild(HomeRoute.FOLDERS, routeName, FoldersRoute.INDEX, parameters);
			return;
		}
		if (routeName.startsWith('Tracks')) {
			this.navigateToChild(HomeRoute.TRACKS, routeName, TracksRoute.FAV, parameters);
			return;
		}
		if (routeName.startsWith('Genres')) {
			this.navigateToChild(HomeRoute.GENRES, routeName, GenresRoute.INDEX, parameters);
			return;
		}
		if (routeName.startsWith('Genre')) {
			this.navigateToChild(HomeRoute.GENRE, routeName, GenreRoute.ARTISTS, parameters);
			return;
		}
		if (navigator) {
			navigator.dispatch(
				CommonActions.navigate({ name: routeName, params: parameters })
			);
		}
	},

	navigateTo(navig: Navig): void {
		NavigationService.navigate(navig.route, navig.params);
	},

	navigateLink(link: RouteLink): void {
		NavigationService.navigateTo(link.navig);
	},

	routeByObjType(objectType: JamObjectType): string | undefined {
		switch (objectType) {
			case JamObjectType.album: {
				return HomeRoute.ALBUM;
			}
			case JamObjectType.artist: {
				return HomeRoute.ARTIST;
			}
			case JamObjectType.folder: {
				return HomeRoute.FOLDER;
			}
			case JamObjectType.track: {
				return HomeRoute.TRACK;
			}
			case JamObjectType.podcast: {
				return HomeRoute.PODCAST;
			}
			case JamObjectType.episode: {
				return HomeRoute.EPISODE;
			}
			case JamObjectType.playlist: {
				return HomeRoute.PLAYLIST;
			}
			case JamObjectType.series: {
				return HomeRoute.SERIE;
			}
			case JamObjectType.genre: {
				return HomeRoute.GENRE;
			}
			default:
		}
	},

	navigateObj(objectType: string, id: string, name: string): void {
		const route = NavigationService.routeByObjType(objectType as JamObjectType);
		if (route) {
			NavigationService.navigate(route, { id, name });
		}
	}
};
