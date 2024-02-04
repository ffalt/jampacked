/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {NativeModules} from 'react-native';

jest.mock('./node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('react-native-reanimated/lib/module/reanimated2/jestUtils').setUpTests();

// react-native-background-downloader
NativeModules.RNBackgroundDownloader = {
	addListener: jest.fn(),
	removeListeners: jest.fn(),
	download: jest.fn(),
	pauseTask: jest.fn(),
	resumeTask: jest.fn(),
	stopTask: jest.fn(),
	TaskRunning: 0,
	TaskSuspended: 1,
	TaskCanceling: 2,
	TaskCompleted: 3,
	initDownloader: jest.fn(),
	checkForExistingDownloads: jest.fn().mockImplementation(() => {
		const foundDownloads = [
			{
				id: 'taskRunning',
				state: NativeModules.RNBackgroundDownloader.TaskRunning,
				percent: 0.5,
				bytesWritten: 50,
				totalBytes: 100
			},
			{
				id: 'taskPaused',
				state: NativeModules.RNBackgroundDownloader.TaskSuspended,
				percent: 0.7,
				bytesWritten: 70,
				totalBytes: 100
			},
			{
				id: 'taskCancelled',
				percent: 0.9,
				state: NativeModules.RNBackgroundDownloader.TaskCanceling,
				bytesWritten: 90,
				totalBytes: 100
			},
			{
				id: 'taskCompletedExplicit',
				state: NativeModules.RNBackgroundDownloader.TaskCompleted,
				percent: 1,
				bytesWritten: 100,
				totalBytes: 100
			},
			{
				id: 'taskCompletedImplicit',
				state: NativeModules.RNBackgroundDownloader.TaskCompleted,
				percent: 1,
				bytesWritten: 100,
				totalBytes: 100
			},
			{
				id: 'taskFailed',
				state: NativeModules.RNBackgroundDownloader.TaskCompleted,
				percent: 0.9,
				bytesWritten: 90,
				totalBytes: 100
			}
		]
		return Promise.resolve(foundDownloads);
	})
};

// react-native-fs
NativeModules.RNFSManager = {
	RNFSFileTypeRegular: 0
};

// react-native-snackbar
NativeModules.RNSnackbar = {
	LENGTH_LONG: 0
};

// react-native-track-player
NativeModules.TrackPlayerModule = {};

jest.mock('react-native-track-player', () => ({
	Event: {
		PlaybackState: 'playback-state',
	},
	__esModule: true,
	default: {
		addEventListener: () => ({
			remove: jest.fn()
		}),
		registerEventHandler: jest.fn(),
		registerPlaybackService: jest.fn(),
		setupPlayer: jest.fn(),
		destroy: jest.fn(),
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


jest.mock('react-native-bootsplash', () => {
	return {RNBootSplash: jest.fn()};
});
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
			cleanDb: () => Promise.resolve(),
			executeSql: (query) => {
				return Promise.resolve([]);
			}
		};
	}
}));
