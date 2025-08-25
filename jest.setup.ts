import { NativeModules } from 'react-native';

jest.mock('./node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js');

// react-native-snackbar
NativeModules.RNSnackbar = {
	LENGTH_LONG: 0
};

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

jest.mock('react-native-nitro-sqlite', () => ({
	NITRO_SQLITE_NULL: jest.fn,
	open: () => ({
		executeAsync: jest.fn
	})
}));

jest.mock('@react-navigation/material-top-tabs', () =>
	({ createMaterialTopTabNavigator: jest.fn() }));

jest.mock('react-native-pager-view', () =>
	({ SceneMap: jest.fn(), TabView: jest.fn() }));
