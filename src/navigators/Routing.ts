import {Route, RouteProp} from '@react-navigation/core';
import {AlbumType} from '../services/jam';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// App Routes

export enum AppRouting {
	AUTH = 'Auth',
	APP = 'App',
	LOAD = 'Load',
}

export type AppStackNavigatorParamList = {
	Auth: undefined;
	App: undefined;
	Load: undefined;
};

export type AppStackProps<T extends keyof AppStackNavigatorParamList> = {
	navigation: NativeStackNavigationProp<AppStackNavigatorParamList, T>;
	route: Route<T>;
};

// Modal Routes

export enum ModalRouting {
	MAIN = 'Main',
	PLAYER = 'Player'
}

export type ModalStackNavigatorParamList = {
	Main: undefined;
	Player: { toQueue: boolean };
};

export type ModalStackProps<T extends keyof ModalStackNavigatorParamList> = {
	navigation: NativeStackNavigationProp<ModalStackNavigatorParamList, T>;
	route: RouteProp<ModalStackNavigatorParamList, T>;
};

// Bottom Tab Routes

export enum BottomTabRoute {
	HOME = 'Home',
	SEARCH = 'Search',
	SETTINGS = 'Settings'
}

export type BottomTabNavigatorParamList = {
	Home: undefined;
	Search: undefined;
	Settings: undefined;
};

export type BottomTabProps<T extends keyof BottomTabNavigatorParamList> = {
	navigation: NativeStackNavigationProp<BottomTabNavigatorParamList, T>;
	route: Route<T>;
};

export type BottomTabParams = {
	Home: undefined;
	Search: undefined;
	Settings: undefined;
};

// Home Routes

export enum HomeRoute {
	START = 'Start',
	ARTISTS = 'Artists',
	ALBUMS = 'Albums',
	SERIES = 'Series',
	FOLDERS = 'Folders',
	SERIE = 'Serie',
	ARTIST = 'Artist',
	FOLDER = 'Folder',
	PODCASTS = 'Podcasts',
	PODCAST = 'Podcast',
	EPISODE = 'Episode',
	PLAYLIST = 'Playlist',
	PLAYLISTS = 'Playlists',
	TRACK = 'Track',
	ALBUM = 'Album',
	TRACKS = 'Tracks',
	USER = 'User',
	DOWNLOADS = 'Downloads',
	BOOKMARKS = 'Bookmarks',
	GENRES = 'Genres',
	GENRE = 'Genre'
}

export type HomeRouteParamList = {
	Start: undefined;
	Artists: undefined;
	Series: undefined;
	Albums: { albumType: AlbumType };
	Folders: { albumType: AlbumType };
	Genres: undefined;
	Tracks: undefined;
	Podcasts: undefined;
	Downloads: undefined;
	Playlists: undefined;
	User: undefined;
	Bookmarks: undefined;
	Playlist: { id: string, name: string };
	Episode: { id: string, name: string };
	Podcast: { id: string, name: string };
	Track: { id: string, name: string };
	Folder: { id: string, name: string };
	Serie: { id: string, name: string };
	Artist: { id: string, name: string };
	Album: { id: string, name: string };
	Genre: { id: string, name: string };
};

export type HomeRouteProps<T extends keyof HomeRouteParamList> = {
	navigation: NativeStackNavigationProp<HomeRouteParamList, T>;
	route: RouteProp<HomeRouteParamList, T>;
};

// Artist Routes

export enum ArtistsRoute {
	INDEX = 'ArtistsIndex',
	FAV = 'ArtistsFav',
	RECENT = 'ArtistsRecent',
	RANDOM = 'ArtistsRandom',
	HIGHEST = 'ArtistsHighest',
	AVGHIGHEST = 'ArtistsAvgHighest',
	FREQUENT = 'ArtistsFrequent'
}

export type ArtistsRouteParamList = {
	ArtistsIndex: undefined;
	ArtistsFav: undefined;
	ArtistsRecent: undefined;
	ArtistsRandom: undefined;
	ArtistsHighest: undefined;
	ArtistsAvgHighest: undefined;
	ArtistsFrequent: undefined;
};

export type ArtistsRouteProps<T extends keyof ArtistsRouteParamList> = {
	navigation: NativeStackNavigationProp<ArtistsRouteParamList, T>;
	route: RouteProp<ArtistsRouteParamList, T>;
};

// Tracks Routes

export enum TracksRoute {
	FAV = 'TracksFav',
	RECENT = 'TracksRecent',
	RANDOM = 'TracksRandom',
	HIGHEST = 'TracksHighest',
	AVGHIGHEST = 'TracksAvgHighest',
	FREQUENT = 'TracksFrequent'
}

export type TracksRouteParamList = {
	TracksFav: undefined;
	TracksRecent: undefined;
	TracksRandom: undefined;
	TracksHighest: undefined;
	TracksAvgHighest: undefined;
	TracksFrequent: undefined;
};

export type TracksRouteProps<T extends keyof TracksRouteParamList> = {
	navigation: NativeStackNavigationProp<TracksRouteParamList, T>;
	route: RouteProp<TracksRouteParamList, T>;
};

// Album Routes

export enum AlbumRoute {
	MAIN = 'AlbumMain',
	INFO = 'AlbumInfo',
}

export type AlbumRouteParamList = {
	AlbumMain: { id?: string; name?: string };
	AlbumInfo: { id?: string; name?: string };
};

export type AlbumRouteProps<T extends keyof AlbumRouteParamList> = {
	navigation: NativeStackNavigationProp<AlbumRouteParamList, T>;
	route: RouteProp<AlbumRouteParamList, T>;
};

// Albums Routes

export enum AlbumsRoute {
	INDEX = 'AlbumsIndex',
	FAV = 'AlbumsFav',
	RECENT = 'AlbumsRecent',
	RANDOM = 'AlbumsRandom',
	HIGHEST = 'AlbumsHighest',
	AVGHIGHEST = 'AlbumsAvgHighest',
	FREQUENT = 'AlbumsFrequent'
}

export type AlbumsRouteParamList = {
	AlbumsIndex: { albumType?: AlbumType };
	AlbumsFav: { albumType?: AlbumType };
	AlbumsRecent: { albumType?: AlbumType };
	AlbumsRandom: { albumType?: AlbumType };
	AlbumsHighest: { albumType?: AlbumType };
	AlbumsAvgHighest: { albumType?: AlbumType };
	AlbumsFrequent: { albumType?: AlbumType };
};

export type AlbumsRouteProps<T extends keyof AlbumsRouteParamList> = {
	navigation: NativeStackNavigationProp<AlbumsRouteParamList, T>;
	route: RouteProp<AlbumsRouteParamList, T>;
};

// Series Routes

export enum SeriesRoute {
	INDEX = 'SeriesIndex',
	FAV = 'SeriesFav',
	RECENT = 'SeriesRecent',
	RANDOM = 'SeriesRandom',
	HIGHEST = 'SeriesHighest',
	AVGHIGHEST = 'SeriesAvgHighest',
	FREQUENT = 'SeriesFrequent'
}

export type SeriesRouteParamList = {
	SeriesIndex: undefined;
	SeriesFav: undefined;
	SeriesRecent: undefined;
	SeriesRandom: undefined;
	SeriesHighest: undefined;
	SeriesAvgHighest: undefined;
	SeriesFrequent: undefined;
};

export type SeriesRouteProps<T extends keyof SeriesRouteParamList> = {
	navigation: NativeStackNavigationProp<SeriesRouteParamList, T>;
	route: RouteProp<SeriesRouteParamList, T>;
};

// Folders Routes

export enum FoldersRoute {
	INDEX = 'FoldersIndex',
	FAV = 'FoldersFav',
	RECENT = 'FoldersRecent',
	RANDOM = 'FoldersRandom',
	HIGHEST = 'FoldersHighest',
	AVGHIGHEST = 'FoldersAvgHighest',
	FREQUENT = 'FoldersFrequent'
}

export type FoldersRouteParamList = {
	FoldersIndex: { albumType?: AlbumType };
	FoldersFav: { albumType?: AlbumType };
	FoldersRecent: { albumType?: AlbumType };
	FoldersRandom: { albumType?: AlbumType };
	FoldersHighest: { albumType?: AlbumType };
	FoldersAvgHighest: { albumType?: AlbumType };
	FoldersFrequent: { albumType?: AlbumType };
};

export type FoldersRouteProps<T extends keyof FoldersRouteParamList> = {
	navigation: NativeStackNavigationProp<FoldersRouteParamList, T>;
	route: RouteProp<FoldersRouteParamList, T>;
};

// Downloads Routes

export enum DownloadsRoute {
	ACTIVE = 'DownloadsActive',
	PINNED = 'DownloadsPinned'
}

export type DownloadsRouteParamList = {
	DownloadsActive: undefined;
	DownloadsPinned: undefined;
};

export type DownloadsRouteProps<T extends keyof DownloadsRouteParamList> = {
	navigation: NativeStackNavigationProp<DownloadsRouteParamList, T>;
	route: RouteProp<DownloadsRouteParamList, T>;
};

// Genres Routes

export enum GenresRoute {
	INDEX = 'GenreIndex'
}

export type GenresRouteParamList = {
	GenreIndex: undefined;
};

export type GenresRouteProps<T extends keyof GenresRouteParamList> = {
	navigation: NativeStackNavigationProp<GenresRouteParamList, T>;
	route: RouteProp<GenresRouteParamList, T>;
};

// Genre Routes

export enum GenreRoute {
	ALBUMS = 'GenreAlbums',
	ARTISTS = 'GenreArtists',
	TRACKS = 'GenreTracks'
}

export type GenreRouteParamList = {
	GenreAlbums: { id: string, name: string };
	GenreArtists: { id: string, name: string };
	GenreTracks: { id: string, name: string };
};

export type GenreRouteProps<T extends keyof GenreRouteParamList> = {
	navigation: NativeStackNavigationProp<GenreRouteParamList, T>;
	route: RouteProp<GenreRouteParamList, T>;
};

