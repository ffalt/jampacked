import {createTheming} from '@callstack/react-theme-provider';
import {DefaultTheme} from '@react-navigation/native';
import React, {useContext} from 'react';
import {Appearance} from 'react-native';

export declare type NavigationTheme = {
	dark: boolean;
	colors: {
		primary: string;
		background: string;
		card: string;
		text: string;
		border: string;
		notification: string;
	};
};

export const staticTheme = {
	fontSizeHuge: 30,
	fontSizeBig: 24,
	fontSizeLarge: 20,
	fontSize: 16,
	fontSizeSmall: 13,
	fontSizeTiny: 11,

	paddingLarge: 15,
	padding: 10,
	paddingSmall: 5,

	marginLarge: 15,
	margin: 10,
	marginSmall: 5,

	statusBarOffset: 25,
	a2zWidth: 40,
	iconHeaderHeight: 140,

	cover: 300,
	userImage: 40,
	thumb: 46,
	thumbMedium: 80
};

// export type ITheme = ReturnType<typeof useTheme>;
export interface ITheme {
	name: string;
	textColor: string;
	muted: string;
	background: string;
	itemBackground: string;
	overlayGradient: Array<string>;
	gradient: Array<string>;
	separator: string;
	activeBackgroundColor: string;
	control: string;
	sidebar: string;
	warning: string;
	progress: string;
	sliderHandle: string;
	activeTintColor: string;
	inactiveTintColor: string;
	barStyle: 'default' | 'light-content' | 'dark-content';
	overlay: string;
	overlayText: string;
	overlayTextActive: string;
	navigation: NavigationTheme;
	waveform: {
		active: string;
		activeInverse: string;
		activePlayable: string;
		activePlayableInverse: string;
		inactive: string;
		inactiveInverse: string;
	}
	refreshCtrlBackground: string;
	refreshCtrlColors: Array<string>;
	statusBar: string;
}

const light: ITheme = {
	name: 'light',
	barStyle: 'dark-content',
	textColor: '#000000',
	muted: '#202020',
	background: '#ffffff',
	itemBackground: '#f3f3f3',
	overlayGradient: ['rgba(255, 255, 255, 0.7)', '#ffffff'],
	gradient: ['#cfcfcf','#e9e9e9', '#ffffff'],
	separator: '#a3a3a3',
	activeBackgroundColor: '#dff8ff',
	control: '#f3f3f3',
	sidebar: '#ffffff',
	progress: '#6c6c6e',
	sliderHandle: '#000000',
	activeTintColor: '#5bbcd3',
	inactiveTintColor: '#90948b',
	warning: '#db3334',
	refreshCtrlBackground: 'rgba(255,255,255,0.8)',
	refreshCtrlColors: ['#00a9e0', '#309712'],
	overlay: 'rgba(255,255,255,0.3)',
	overlayText: '#000000',
	overlayTextActive: '#062456',
	statusBar: 'rgba(255,255,255,0.7)',
	navigation: {
		dark: false,
		colors: {
			...DefaultTheme.colors,
			primary: '#2d7c61',
			card: '#eaeaea',
			background: '#ffffff'
		}
	},
	waveform: {
		active: '#005b00',
		activeInverse: '#005b00',
		activePlayable: '#008300',
		activePlayableInverse: '#008300',
		inactive: 'gray',
		inactiveInverse: 'gray'
	}
};

const dark: ITheme = {
	name: 'dark',
	textColor: '#eeeeee',
	barStyle: 'light-content',
	muted: '#808080',
	background: '#0b1821',
	itemBackground: '#090a12',
	overlayGradient: ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)', '#0b1821'],
	gradient: ['#000000', '#081318', '#0b1821'],
	activeBackgroundColor: '#053e62',
	separator: '#0b2932',
	control: '#191f2b',
	sidebar: '#191f2b',
	progress: '#6c6c6e',
	sliderHandle: '#ffffff',
	activeTintColor: '#5bbcd3',
	inactiveTintColor: '#a2a69d',
	warning: '#e60010',
	refreshCtrlBackground: 'rgba(0,0,0,0.2)',
	refreshCtrlColors: ['#00a9e0', '#309712'],
	overlay: 'rgba(0,0,0,0.5)',
	overlayText: '#ffffff',
	overlayTextActive: '#93aed0',
	statusBar: 'rgba(0,0,0,0.5)',
	navigation: {
		dark: true,
		colors: {
			primary: '#008300',
			background: '#0b1821',
			card: '#0b1821',
			text: '#D3D7CE',
			border: '#545456',
			notification: '#0b1821'
		}
	},
	waveform: {
		active: '#006f00',
		activeInverse: '#006f00',
		activePlayable: '#008300',
		activePlayableInverse: '#008300',
		inactive: '#008300',
		inactiveInverse: '#008300'
	}
};

const black: ITheme = {
	name: 'black',
	textColor: '#eeeeee',
	barStyle: 'light-content',
	muted: '#808080',
	background: '#000000',
	itemBackground: '#090a12',
	overlayGradient: ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)', '#000000'],
	gradient: ['#0a0c15', '#000000'],
	activeBackgroundColor: '#053e62',
	separator: '#0b2932',
	control: '#191f2b',
	sidebar: '#000715',
	progress: '#6c6c6e',
	sliderHandle: '#ffffff',
	activeTintColor: '#5bbcd3',
	inactiveTintColor: '#a2a69d',
	warning: '#e60010',
	refreshCtrlBackground: 'rgba(0,0,0,0.2)',
	refreshCtrlColors: ['#00a9e0', '#309712'],
	overlay: 'rgba(0,0,0,0.5)',
	overlayText: '#ffffff',
	overlayTextActive: '#87a7d6',
	statusBar: 'rgba(0,0,0,0.5)',
	navigation: {
		dark: true,
		colors: {
			primary: '#008300',
			background: '#000000',
			card: '#090a12',
			text: '#D3D7CE',
			border: '#545456',
			notification: '#090a12'
		}
	},
	waveform: {
		active: '#006f00',
		activeInverse: '#006f00',
		activePlayable: '#008300',
		activePlayableInverse: '#008300',
		inactive: '#008300',
		inactiveInverse: '#008300'
	}
};

const themes: {
	light: ITheme,
	dark: ITheme,
	black: ITheme, [name: string]: ITheme
} = {light, dark, black};

export const themeList: Array<{ key: string, label: string }> = [
	{key: 'auto', label: 'System Theme'},
	{key: 'light', label: 'Light'},
	{key: 'dark', label: 'Dark'},
	{key: 'black', label: 'Black'}
];

export interface ThemeSettings {
	theme: ITheme;
	setTheme: (themeName: string) => void;
	loadUserTheme: () => Promise<void>;
}

export function getAutoTheme(): ITheme {
	return {...(Appearance.getColorScheme() === 'dark' ? dark : light), name: 'auto'};
}

export function getTheme(name?: string | null): ITheme {
	if (!name || name === 'auto') {
		return getAutoTheme();
	}
	return themes[name] || themes.light;
}

export const ThemeContext = React.createContext<ThemeSettings>(
	{
		theme: getAutoTheme(),
		loadUserTheme: async (): Promise<void> => {
			// nope
		},
		setTheme: (): void => {
			// nope
		}
	}
);

export const {ThemeProvider, useTheme} = createTheming(getAutoTheme());
export const useThemeContext = (): ThemeSettings => useContext<ThemeSettings>(ThemeContext);
