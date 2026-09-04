import { NativeModules } from 'react-native';

// Silence the deprecation warning emitted by @react-navigation/stack when it
// accesses the (deprecated) InteractionManager from react-native at require time.
const originalWarn = console.warn.bind(console);
console.warn = (...args: Array<unknown>): void => {
	if (typeof args[0] === 'string' && args[0].includes('InteractionManager has been deprecated')) {
		return;
	}
	originalWarn(...args);
};

jest.mock('./node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js');

// react-native-snackbar
NativeModules.RNSnackbar = {
	LENGTH_LONG: 0
};

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-return
jest.mock('./src/style/theming.ts', () => require('./__mocks__/style/theming.ts'));
jest.mock('./src/services/apollo.service.ts');

// react-native-track-player is mocked by <rootDir>/__mocks__/react-native-track-player.ts

jest.mock('react-native-gesture-handler', () =>
	({ RNGestureHandlerModule: jest.fn() }));

jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => ({
	__esModule: true,
	default: 'ReanimatedSwipeable'
}));

// react-native-reanimated 4.6.0 calls setCSSEventHandler() while initializing at import time, but under
// Jest the module resolves to JSReanimated, whose setCSSEventHandler throws. Stub out that one function.
jest.mock('react-native-reanimated/src/css/native/proxy', () => ({
	...jest.requireActual<object>('react-native-reanimated/src/css/native/proxy'),
	setCSSEventHandler: jest.fn()
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-return
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-worklets', () => ({
	// threads
	runOnUI: jest.fn((worklet: unknown) => worklet),
	runOnUIAsync: jest.fn((worklet: unknown) => worklet),
	runOnUISync: jest.fn((worklet: unknown) => worklet),
	scheduleOnUI: jest.fn(),
	scheduleOnRN: jest.fn(),
	runOnJS: jest.fn((worklet: unknown) => worklet),
	executeOnUIRuntimeSync: jest.fn(),
	// memory
	makeShareable: jest.fn((v: unknown) => v),
	makeShareableCloneRecursive: jest.fn((v: unknown) => v),
	makeShareableCloneOnUIRecursive: jest.fn((v: unknown) => v),
	isShareableRef: jest.fn(() => false),
	callMicrotasks: jest.fn(),
	shareableMappingCache: new Map(),
	createSerializable: jest.fn((v: unknown) => v),
	isSerializableRef: jest.fn(() => false),
	registerCustomSerializable: jest.fn(),
	serializableMappingCache: new Map(),
	createShareable: jest.fn((v: unknown) => v),
	createSynchronizable: jest.fn((v: unknown) => v),
	isShareable: jest.fn(() => false),
	isSynchronizable: jest.fn(() => false),
	// runtimes
	createWorkletRuntime: jest.fn(),
	getUIRuntimeHolder: jest.fn(),
	getUISchedulerHolder: jest.fn(),
	runOnRuntime: jest.fn(),
	runOnRuntimeAsync: jest.fn(),
	runOnRuntimeAsyncWithId: jest.fn(),
	runOnRuntimeSync: jest.fn(),
	runOnRuntimeSyncWithId: jest.fn(),
	scheduleOnRuntime: jest.fn(),
	scheduleOnRuntimeWithId: jest.fn(),
	UIRuntimeId: 0,
	// runtimeKind
	getRuntimeKind: jest.fn(),
	isRNRuntime: jest.fn(() => true),
	isUIRuntime: jest.fn(() => false),
	isWorkerRuntime: jest.fn(() => false),
	isWorkletRuntime: jest.fn(() => false),
	RuntimeKind: {},
	// featureFlags
	getDynamicFeatureFlag: jest.fn(),
	getStaticFeatureFlag: jest.fn(),
	setDynamicFeatureFlag: jest.fn(),
	// misc
	toggleSlowAnimationsOnUIRuntime: jest.fn(),
	isWorkletFunction: jest.fn(() => false),
	WorkletsModule: {}
}));

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
