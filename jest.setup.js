/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {NativeModules} from 'react-native';

jest.mock('./node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

// react-native-snackbar
NativeModules.RNSnackbar = {
	LENGTH_LONG: 0
};

// react-native-track-player
// NativeModules.TrackPlayerModule = {};
jest.mock('react-native-track-player', () => ({
	__esModule: true,
	default: {
		addEventListener: () => ({
			remove: jest.fn()
		}),
		registerEventHandler: jest.fn(),
		registerPlaybackService: jest.fn(),
		setupPlayer: jest.fn(),
		updateOptions: jest.fn(),
		reset: jest.fn(),
		add: jest.fn(),
		remove: jest.fn(),
		skip: jest.fn(),
		skipToNext: jest.fn(),
		skipToPrevious: jest.fn(),
		removeUpcomingTracks: jest.fn(),
		// playback commands
		play: jest.fn(),
		pause: jest.fn(),
		stop: jest.fn(),
		seekTo: jest.fn(),
		setVolume: jest.fn(),
		setRate: jest.fn(),
		// player getters
		getQueue: jest.fn(),
		getTrack: jest.fn(),
		getCurrentTrack: jest.fn(),
		getVolume: jest.fn(),
		getDuration: jest.fn(),
		getPosition: jest.fn(),
		getBufferedPosition: jest.fn(),
		getState: jest.fn(),
		getRate: jest.fn()
	},
	useTrackPlayerProgress: () => ({
		position: 100,
		duration: 200
	})
}));

// react-native-screens
jest.mock('react-native-screens', () => ({
	...jest.requireActual('react-native-screens'),
	enableScreens: jest.fn()
}));
jest.mock('react-native-sqlite-storage', () => ({
	DEBUG: jest.fn,
	enablePromise: jest.fn(),
	openDatabase: (...args1) => {
		return {
			transaction: (...args2) => Promise.resolve({
				executeSql: (query) => {
					return Promise.resolve([]);
				}
			}),
			cleanDb: ()=> Promise.resolve(),
			executeSql: (query) => {
				return Promise.resolve([]);
			}
		};
	}
}));
