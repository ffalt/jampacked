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
	Player: undefined;
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
	ALBUM = 'Album',
	START = 'Start',
}

export type HomeStackNavigatorParamList = {
	Start: undefined;
	Artists: undefined;
	Series: undefined;
	Albums: { albumTypeID: string };
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
