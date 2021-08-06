import {NativeModules } from 'react-native';

// @react-native-async-storage
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// react-native-reanimated
import mockReanimated from 'react-native-reanimated/mock';
jest.mock('react-native-reanimated', () => mockReanimated);

// react-native-snackbar
NativeModules.RNSnackbar = {
	LENGTH_LONG: 0
};

// react-native-background-downloader
jest.mock('../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js');

NativeModules.RNBackgroundDownloader = {
	download: jest.fn(),
	pauseTask: jest.fn(),
	resumeTask: jest.fn(),
	stopTask: jest.fn(),
	TaskRunning: 0,
	TaskSuspended: 1,
	TaskCanceling: 2,
	TaskCompleted: 3,
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

// react-native-track-player
NativeModules.TrackPlayerModule = {
};

// react-native-screens
jest.mock('react-native-screens', () => ({
	...jest.requireActual('react-native-screens'),
	enableScreens: jest.fn(),
}));
