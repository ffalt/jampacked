import {AlbumType, ListType} from '../services/jam';
import {AlbumsRoute, ArtistsRoute, BottomTabRoute, FoldersRoute, HomeRoute, SeriesRoute} from './Routing';
import {Navig} from '../services/types';
import {getAlbumTypeInfos} from '../services/jam-lists';

export interface RouteLink {
	title: string;
	icon: string;
	navig: Navig;
}

export class JamRouteLinks {
	static artists(): RouteLink {
		return ({title: 'Artists', icon: 'artist', navig: {route: HomeRoute.ARTISTS}});
	}

	static artistlistRoute(listType: ListType): ArtistsRoute {
		switch (listType) {
			case ListType.random:
				return ArtistsRoute.RANDOM;
			case ListType.highest:
				return ArtistsRoute.HIGHEST;
			case ListType.avghighest:
				return ArtistsRoute.AVGHIGHEST;
			case ListType.frequent:
				return ArtistsRoute.FREQUENT;
			case ListType.faved:
				return ArtistsRoute.FAV;
			case ListType.recent:
				return ArtistsRoute.RECENT;
		}
	}

	static albumlistRoute(listType: ListType): AlbumsRoute {
		switch (listType) {
			case ListType.random:
				return AlbumsRoute.RANDOM;
			case ListType.highest:
				return AlbumsRoute.HIGHEST;
			case ListType.avghighest:
				return AlbumsRoute.AVGHIGHEST;
			case ListType.frequent:
				return AlbumsRoute.FREQUENT;
			case ListType.faved:
				return AlbumsRoute.FAV;
			case ListType.recent:
				return AlbumsRoute.RECENT;
		}
	}

	static serieslistRoute(listType: ListType): SeriesRoute {
		switch (listType) {
			case ListType.random:
				return SeriesRoute.RANDOM;
			case ListType.highest:
				return SeriesRoute.HIGHEST;
			case ListType.avghighest:
				return SeriesRoute.AVGHIGHEST;
			case ListType.frequent:
				return SeriesRoute.FREQUENT;
			case ListType.faved:
				return SeriesRoute.FAV;
			case ListType.recent:
				return SeriesRoute.RECENT;
		}
	}

	static folderlistRoute(listType: ListType): FoldersRoute {
		switch (listType) {
			case ListType.random:
				return FoldersRoute.RANDOM;
			case ListType.highest:
				return FoldersRoute.HIGHEST;
			case ListType.avghighest:
				return FoldersRoute.AVGHIGHEST;
			case ListType.frequent:
				return FoldersRoute.FREQUENT;
			case ListType.faved:
				return FoldersRoute.FAV;
			case ListType.recent:
				return FoldersRoute.RECENT;
		}
	}

	static artistlist(listType: ListType): RouteLink {
		return ({title: 'Artists', icon: 'artist', navig: {route: JamRouteLinks.artistlistRoute(listType)}});
	}

	static series(): RouteLink {
		return ({title: 'Series', icon: 'series', navig: {route: HomeRoute.SERIES}});
	}

	static folders(): RouteLink {
		return ({title: 'Folders', icon: 'folder', navig: {route: HomeRoute.FOLDERS}});
	}

	static tracks(): RouteLink {
		return ({title: 'Tracks', icon: 'track', navig: {route: HomeRoute.TRACKS}});
	}

	static podcasts(): RouteLink {
		return ({title: 'Podcasts', icon: 'podcast', navig: {route: HomeRoute.PODCASTS}});
	}

	static albums(albumType: AlbumType): RouteLink {
		const t = getAlbumTypeInfos(albumType);
		return ({title: t?.title || 'Albums', icon: t?.icon || 'album', navig: {route: HomeRoute.ALBUMS, params: {albumType}}});
	}

	static albumlist(listType: ListType, albumType: AlbumType): RouteLink {
		const t = getAlbumTypeInfos(albumType);
		return ({title: t?.title || 'Albums', icon: t?.icon || 'album', navig: {route: JamRouteLinks.albumlistRoute(listType), params: {albumType}}});
	}

	static serieslist(listType: ListType): RouteLink {
		return ({title: 'Series', icon: 'series', navig: {route: JamRouteLinks.serieslistRoute(listType)}});
	}

	static folderlist(listType: ListType, albumType?: AlbumType): RouteLink {
		return ({title: 'Folders', icon: 'folder', navig: {route: JamRouteLinks.folderlistRoute(listType), params: {albumType}}});
	}

	static tracklist(listType: ListType): RouteLink {
		return ({title: 'Tracks', icon: 'track', navig: {route: HomeRoute.TRACKS, params: {listType}}});
	}

	static bookmarks(): RouteLink {
		return ({title: 'Bookmarks', icon: 'bookmark', navig: {route: HomeRoute.BOOKMARKS}});
	}

	static playlists(): RouteLink {
		return ({title: 'Playlists', icon: 'playlist', navig: {route: HomeRoute.PLAYLISTS}});
	}

	static home(): RouteLink {
		return ({title: 'Home', icon: 'home', navig: {route: HomeRoute.START}});
	}

	static settings(): RouteLink {
		return ({title: 'Settings', icon: 'settings', navig: {route: BottomTabRoute.SETTINGS}});
	}

	static user(): RouteLink {
		return ({title: 'User', icon: 'user', navig: {route: HomeRoute.USER}});
	}

	static downloads() {
		return ({title: 'Downloads', icon: 'download', navig: {route: HomeRoute.DOWNLOADS}});
	}
}
