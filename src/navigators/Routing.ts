import {Route, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {AlbumType} from '../services/jam';

// App Routes

export enum Routing {
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
	navigation: StackNavigationProp<AppStackNavigatorParamList, T>;
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
	navigation: StackNavigationProp<ModalStackNavigatorParamList, T>;
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
	navigation: StackNavigationProp<BottomTabNavigatorParamList, T>;
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
	BOOKMARKS = 'Bookmarks'
}

export type HomeRouteParamList = {
	Start: undefined;
	Artists: undefined;
	Series: undefined;
	Albums: { albumType: AlbumType };
	Folders: { albumType: AlbumType };
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
};

export type HomeRouteProps<T extends keyof HomeRouteParamList> = {
	navigation: StackNavigationProp<HomeRouteParamList, T>;
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
	navigation: StackNavigationProp<ArtistsRouteParamList, T>;
	route: RouteProp<ArtistsRouteParamList, T>;
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
	navigation: StackNavigationProp<AlbumsRouteParamList, T>;
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
	navigation: StackNavigationProp<SeriesRouteParamList, T>;
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
	navigation: StackNavigationProp<FoldersRouteParamList, T>;
	route: RouteProp<FoldersRouteParamList, T>;
};

// Folders Routes

export enum DownloadsRoute {
	ACTIVE = 'DownloadsActive'
}

export type DownloadsRouteParamList = {
	DownloadsActive: undefined;
};

export type DownloadsRouteProps<T extends keyof DownloadsRouteParamList> = {
	navigation: StackNavigationProp<DownloadsRouteParamList, T>;
	route: RouteProp<DownloadsRouteParamList, T>;
};
