import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {Route, RouteProp} from '@react-navigation/core';
import {ITheme} from '../style/theming';

export const AuthContext = React.createContext({
	hasUser: false,
	isLoading: true,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	login: async (server: string, name: string, password: string): Promise<void> => {
		// dummy
	},
	logout: async (): Promise<void> => {
		// dummy
	}
});

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
	theme: ITheme;
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

export type ModalStackWithThemeProps<T extends keyof ModalStackNavigatorParamList> = {
	navigation: StackNavigationProp<ModalStackNavigatorParamList, T>;
	route: RouteProp<ModalStackNavigatorParamList, T>;
	theme: ITheme;
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

export type BottomTabWithThemeProps<T extends keyof BottomTabNavigatorParamList> = {
	navigation: StackNavigationProp<BottomTabNavigatorParamList, T>;
	route: Route<T>;
	theme: ITheme;
};

export type BottomTabParams = {
	Home: undefined;
	Search: undefined;
	Settings: undefined;
};

// Home Routes

export enum HomeRoute {
	SERIES = 'Series',
	SERIESITEM = 'SeriesItem',
	ALBUMS = 'Albums',
	ARTISTS = 'Artists',
	ARTIST = 'Artist',
	FOLDER = 'Folder',
	PODCASTS = 'Podcasts',
	PODCAST = 'Podcast',
	EPISODE = 'Episode',
	PLAYLIST = 'Playlist',
	PLAYLISTS = 'Playlists',
	TRACK = 'Track',
	ALBUM = 'Album',
	START = 'Start',
	TRACKS = 'Tracks',
	FOLDERS = 'Folders'
}

export type HomeStackNavigatorParamList = {
	Start: undefined;
	Artists: undefined;
	Series: undefined;
	Folders: undefined;
	Tracks: undefined;
	Podcasts: undefined;
	Playlists: undefined;
	Albums: { albumTypeID: string };
	Playlist: { id: string, name: string };
	Episode: { id: string, name: string };
	Podcast: { id: string, name: string };
	Track: { id: string, name: string };
	Folder: { id: string, name: string };
	SeriesItem: { id: string, name: string };
	Artist: { id: string, name: string };
	Album: { id: string, name: string };
};

export type HomeStackProps<T extends keyof HomeStackNavigatorParamList> = {
	navigation: StackNavigationProp<HomeStackNavigatorParamList, T>;
	route: Route<T>;
};

export type HomeStackWithThemeProps<T extends keyof HomeStackNavigatorParamList> = {
	navigation: StackNavigationProp<HomeStackNavigatorParamList, T>;
	route: RouteProp<HomeStackNavigatorParamList, T>;
	theme: ITheme;
};
