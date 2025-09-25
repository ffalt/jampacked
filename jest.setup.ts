import { NativeModules } from 'react-native';

jest.mock('./node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js');

// react-native-snackbar
NativeModules.RNSnackbar = {
	LENGTH_LONG: 0
};

jest.mock('./src/style/theming.ts');
jest.mock('./src/services/apollo.service.ts');

jest.mock('react-native-track-player', () => ({
	__esModule: true,
	TrackPlayerDownloadManager: jest.fn(() => ({ init: jest.fn() })),
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

jest.mock('react-native-gesture-handler', () =>
	({ RNGestureHandlerModule: jest.fn() }));

jest.mock('react-native-gesture-handler/Swipeable', () =>
	({ RNGestureHandlerModule: jest.fn() }));

jest.mock('react-native-bootsplash', () =>
	({ RNBootSplash: jest.fn() }));

jest.mock('react-native-screens', () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
	const screens = jest.requireActual('react-native-screens').default;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return ({ ...screens, enableScreens: jest.fn() });
});

jest.mock('@react-navigation/material-top-tabs', () =>
	({ createMaterialTopTabNavigator: jest.fn() }));

jest.mock('react-native-pager-view', () =>
	({ SceneMap: jest.fn(), TabView: jest.fn() }));

jest.mock('@op-engineering/op-sqlite', () => ({
	open: jest.fn(() => ({
		execute: jest.fn(async () => Promise.resolve({ rows: { _array: [] }, insertId: 1, rowsAffected: 0 })),
		transaction: jest.fn((callback: (tx: any) => void) => {
			const tx = {
				execute: jest.fn(async () => Promise.resolve({ rows: { _array: [] }, insertId: 1, rowsAffected: 0 }))
			};
			return callback(tx);
		}),
		close: jest.fn(async () => Promise.resolve())
	}))
}));

jest.mock('react-native-keychain', () => ({
	STORAGE_TYPE: {
		FB: 'MOCK_FacebookConceal',
		AES: 'MOCK_KeystoreAESGCM',
		AES_GCM: 'MOCK_KeystoreAESCBC',
		AES_GCM_NO_AUTH: 'MOCK_KeystoreAESGCMNoAuth',
		RSA: 'MOCK_KeystoreRSAECB',
		KC: 'MOCK_keychain'
	},
	setGenericPassword: jest.fn(),
	getGenericPassword: jest.fn(),
	resetGenericPassword: jest.fn()
}));
