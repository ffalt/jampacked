import { AlbumType, ListType } from '../services/jam';
import { AlbumsRoute, ArtistsRoute, BottomTabRoute, FoldersRoute, GenreRoute, HomeRoute, SeriesRoute, TracksRoute } from './Routing';
import { Navig } from '../services/types';
import { getAlbumTypeInfos } from '../services/jam-lists';

export interface RouteLink {
	title: string;
	icon: string;
	navig: Navig;
}

export const JamRouteLinks = {
	artists(): RouteLink {
		return ({ title: 'Artists', icon: 'artist', navig: { route: HomeRoute.ARTISTS } });
	},

	artistlistRoute(listType: ListType): ArtistsRoute {
		switch (listType) {
			case ListType.highest: {
				return ArtistsRoute.HIGHEST;
			}
			case ListType.avghighest: {
				return ArtistsRoute.AVGHIGHEST;
			}
			case ListType.frequent: {
				return ArtistsRoute.FREQUENT;
			}
			case ListType.faved: {
				return ArtistsRoute.FAV;
			}
			case ListType.recent: {
				return ArtistsRoute.RECENT;
			}
			// case ListType.random:
			default: {
				return ArtistsRoute.RANDOM;
			}
		}
	},

	albumlistRoute(listType: ListType): AlbumsRoute {
		switch (listType) {
			case ListType.highest: {
				return AlbumsRoute.HIGHEST;
			}
			case ListType.avghighest: {
				return AlbumsRoute.AVGHIGHEST;
			}
			case ListType.frequent: {
				return AlbumsRoute.FREQUENT;
			}
			case ListType.faved: {
				return AlbumsRoute.FAV;
			}
			case ListType.recent: {
				return AlbumsRoute.RECENT;
			}
			// case ListType.random:
			default: {
				return AlbumsRoute.RANDOM;
			}
		}
	},

	serieslistRoute(listType: ListType): SeriesRoute {
		switch (listType) {
			case ListType.highest: {
				return SeriesRoute.HIGHEST;
			}
			case ListType.avghighest: {
				return SeriesRoute.AVGHIGHEST;
			}
			case ListType.frequent: {
				return SeriesRoute.FREQUENT;
			}
			case ListType.faved: {
				return SeriesRoute.FAV;
			}
			case ListType.recent: {
				return SeriesRoute.RECENT;
			}
			// case ListType.random:
			default: {
				return SeriesRoute.RANDOM;
			}
		}
	},

	tracklistRoute(listType: ListType): TracksRoute {
		switch (listType) {
			case ListType.highest: {
				return TracksRoute.HIGHEST;
			}
			case ListType.avghighest: {
				return TracksRoute.AVGHIGHEST;
			}
			case ListType.frequent: {
				return TracksRoute.FREQUENT;
			}
			case ListType.faved: {
				return TracksRoute.FAV;
			}
			case ListType.recent: {
				return TracksRoute.RECENT;
			}
			// case ListType.random:
			default: {
				return TracksRoute.RANDOM;
			}
		}
	},

	folderlistRoute(listType: ListType): FoldersRoute {
		switch (listType) {
			case ListType.highest: {
				return FoldersRoute.HIGHEST;
			}
			case ListType.avghighest: {
				return FoldersRoute.AVGHIGHEST;
			}
			case ListType.frequent: {
				return FoldersRoute.FREQUENT;
			}
			case ListType.faved: {
				return FoldersRoute.FAV;
			}
			case ListType.recent: {
				return FoldersRoute.RECENT;
			}
			// case ListType.random:
			default: {
				return FoldersRoute.RANDOM;
			}
		}
	},

	artistlist(listType: ListType): RouteLink {
		return ({ title: 'Artists', icon: 'artist', navig: { route: JamRouteLinks.artistlistRoute(listType) } });
	},

	series(): RouteLink {
		return ({ title: 'Series', icon: 'series', navig: { route: HomeRoute.SERIES } });
	},

	folders(albumType?: AlbumType): RouteLink {
		return ({ title: 'Folders', icon: 'folder', navig: { route: HomeRoute.FOLDERS, params: { albumType } } });
	},

	tracks(): RouteLink {
		return ({ title: 'Tracks', icon: 'track', navig: { route: HomeRoute.TRACKS } });
	},

	genres(): RouteLink {
		return ({ title: 'Genres', icon: 'genre', navig: { route: HomeRoute.GENRES } });
	},

	genretracks(): RouteLink {
		return ({ title: 'Genres Tracks', icon: 'genre', navig: { route: GenreRoute.TRACKS } });
	},

	genreartists(): RouteLink {
		return ({ title: 'Genres Artists', icon: 'genre', navig: { route: GenreRoute.ARTISTS } });
	},

	genrealbums(): RouteLink {
		return ({ title: 'Genres Albums', icon: 'genre', navig: { route: GenreRoute.ALBUMS } });
	},

	podcasts(): RouteLink {
		return ({ title: 'Podcasts', icon: 'podcast', navig: { route: HomeRoute.PODCASTS } });
	},

	albums(albumType?: AlbumType): RouteLink {
		const t = albumType ? getAlbumTypeInfos(albumType) : undefined;
		return ({ title: t?.title ?? 'Albums', icon: t?.icon ?? 'album', navig: { route: HomeRoute.ALBUMS, params: { albumType } } });
	},

	albumlist(listType: ListType, albumType?: AlbumType): RouteLink {
		const t = albumType ? getAlbumTypeInfos(albumType) : undefined;
		return ({ title: t?.title ?? 'Albums', icon: t?.icon ?? 'album', navig: { route: JamRouteLinks.albumlistRoute(listType), params: { albumType } } });
	},

	serieslist(listType: ListType): RouteLink {
		return ({ title: 'Series', icon: 'series', navig: { route: JamRouteLinks.serieslistRoute(listType) } });
	},

	folderlist(listType: ListType, albumType?: AlbumType): RouteLink {
		return ({ title: 'Folders', icon: 'folder', navig: { route: JamRouteLinks.folderlistRoute(listType), params: { albumType } } });
	},

	tracklist(listType: ListType): RouteLink {
		return ({ title: 'Tracks', icon: 'track', navig: { route: JamRouteLinks.tracklistRoute(listType) } });
	},

	bookmarks(): RouteLink {
		return ({ title: 'Bookmarks', icon: 'bookmark', navig: { route: HomeRoute.BOOKMARKS } });
	},

	playlists(): RouteLink {
		return ({ title: 'Playlists', icon: 'playlist', navig: { route: HomeRoute.PLAYLISTS } });
	},

	home(): RouteLink {
		return ({ title: 'Home', icon: 'home', navig: { route: HomeRoute.START } });
	},

	settings(): RouteLink {
		return ({ title: 'Settings', icon: 'settings', navig: { route: BottomTabRoute.SETTINGS } });
	},

	pinned(): RouteLink {
		return ({ title: 'Pinned', icon: 'download', navig: { route: HomeRoute.PINNED } });
	}
};
