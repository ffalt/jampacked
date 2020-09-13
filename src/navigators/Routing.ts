import {Route, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {AlbumType, ListType} from '../services/jam';

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
	SERIESITEM = 'SeriesItem',
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
	FOLDERS = 'Folders',
	USER = 'User',
	SERIESLIST = 'Serieslist',
	FOLDERLIST = 'Folderlist',
	DOWNLOADS = 'Downloads',
	BOOKMARKS = 'Bookmarks'
}

export type HomeRouteParamList = {
	Start: undefined;
	Artists: undefined;
	Albums: { albumType: AlbumType };

	Series: undefined;
	Folders: undefined;
	Tracks: undefined;
	Podcasts: undefined;
	Downloads: undefined;
	Playlists: undefined;
	User: undefined;
	Bookmarks: undefined;
	Folderlist: { listType: ListType, albumType?: AlbumType };
	Serieslist: { listType: ListType, albumType?: AlbumType };
	Playlist: { id: string, name: string };
	Episode: { id: string, name: string };
	Podcast: { id: string, name: string };
	Track: { id: string, name: string };
	Folder: { id: string, name: string };
	SeriesItem: { id: string, name: string };
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
// Artist Routes

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
	AlbumsIndex: { albumType: AlbumType };
	AlbumsFav: { albumType: AlbumType };
	AlbumsRecent: { albumType: AlbumType };
	AlbumsRandom: { albumType: AlbumType };
	AlbumsHighest: { albumType: AlbumType };
	AlbumsAvgHighest: { albumType: AlbumType };
	AlbumsFrequent: { albumType: AlbumType };
};

export type AlbumsRouteProps<T extends keyof AlbumsRouteParamList> = {
	navigation: StackNavigationProp<AlbumsRouteParamList, T>;
	route: RouteProp<AlbumsRouteParamList, T>;
};
