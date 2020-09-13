import {AlbumType, JamObjectType, ListType} from '../services/jam';
import {HomeRoute} from './Routing';
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

	static artistlist(listType: ListType): RouteLink {
		return ({title: 'Artists', icon: 'artist', navig: {route: HomeRoute.ARTISTLIST, params: {listType}}});
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
		return ({title: t?.title || 'Albums', icon: t?.icon || 'album', navig: {route: HomeRoute.ALBUMLIST, params: {albumType, listType}}});
	}

	static serieslist(listType: ListType): RouteLink {
		return ({title: 'Series', icon: 'series', navig: {route: HomeRoute.SERIESLIST, params: {listType}}});
	}

	static folderlist(listType: ListType): RouteLink {
		return ({title: 'Folders', icon: 'folder', navig: {route: HomeRoute.FOLDERLIST, params: {listType}}});
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

	static downloads() {
		return ({title: 'Downloads', icon: 'download', navig: {route: HomeRoute.DOWNLOADS}});
	}
}
