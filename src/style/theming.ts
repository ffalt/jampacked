import {createTheming} from '@callstack/react-theme-provider';
import {DefaultTheme} from '@react-navigation/native';
import React from 'react';

export declare type NavigationTheme = {
	dark: boolean;
	colors: {
		primary: string;
		background: string;
		card: string;
		text: string;
		border: string;
	};
};

export const staticTheme = {
	fontSizeHuge: 30,
	fontSizeBig: 24,
	fontSizeLarge: 20,
	fontSize: 16,
	fontSizeSmall: 13,

	paddingLarge: 15,
	padding: 10,
	paddingSmall: 5,

	marginLarge: 15,
	margin: 10,
	marginSmall: 5,

	statusBarOffset: 25
};

// export type ITheme = ReturnType<typeof useTheme>;
export interface ITheme {
	name: string;
	textColor: string;
	background: string;
	itemBackground: string;
	overlayGradient: Array<string>;
	gradient: Array<string>;
	separator: string;
	activeBackgroundColor: string;
	control: string;
	warning: string;
	muted: string;
	progress: string;
	sliderHandle: string;
	activeTintColor: string;
	inactiveTintColor: string;
	barStyle: 'default' | 'light-content' | 'dark-content';
	navigation: NavigationTheme;
	waveform: {
		active: string;
		activeInverse: string;
		activePlayable: string;
		activePlayableInverse: string;
		inactive: string;
		inactiveInverse: string;
	}
}

const light: ITheme = {
	name: 'light',
	barStyle: 'dark-content',
	textColor: '#000000',
	muted: '#202020',
	background: '#ffffff',
	itemBackground: '#f3f3f3',
	overlayGradient: ['rgba(255, 255, 255, 0.8)', '#ffffff'],
	gradient: ['#dadada', '#ffffff'],
	separator: '#a3a3a3',
	activeBackgroundColor: '#dff8ff',
	control: '#f3f3f3',
	progress: '#6c6c6e',
	sliderHandle: '#000000',
	activeTintColor: '#5bbcd3',
	inactiveTintColor: '#90948b',
	warning: '#db3334',
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
	muted: '#586478',
	background: '#0b1821',
	itemBackground: '#090a12',
	overlayGradient: ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)', '#0b1821'],
	gradient: ['#000000', '#0b1821'],
	activeBackgroundColor: '#053e62',
	separator: '#0b2932',
	control: '#191f2b',
	progress: '#6c6c6e',
	sliderHandle: '#ffffff',
	activeTintColor: '#5bbcd3',
	inactiveTintColor: '#a2a69d',
	warning: '#e60010',
	navigation: {
		dark: true,
		colors: {
			primary: '#008300',
			background: '#0b1821',
			card: '#0b1821',
			text: '#D3D7CE',
			border: '#545456'
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

export const themes: { light: ITheme, dark: ITheme, [name: string]: ITheme } = {light, dark};

export interface ThemeSettings {
	theme: ITheme;
	setTheme: (themeName: string) => void;
}

export const ThemeContext = React.createContext<ThemeSettings>(
	{
		theme: themes.dark,
		setTheme: () => {
			// nope
		}
	}
);

export const {ThemeProvider, withTheme, useTheme} = createTheming(themes.dark);
