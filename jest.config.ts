import type { Config } from 'jest';

const config: Config = {
	clearMocks: true,
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/src/__tests__',
		'<rootDir>/src/__fixtures__',
	],
	'transformIgnorePatterns': [
		'node_modules/(?!(' +
		'react-native' +
		'|@react-native' +
		'|react-native-gesture-handler' +
		'|react-native-snackbar' +
		'|react-native-status-bar-height' +
		'|react-native-tab-view' +
		'|react-native-screens' +
		'|react-native-track-player' +
		'|react-native-floating-action' +
		'|@d11/react-native-fast-image' +
		'|d3-array' +
		'|d3-color' +
		'|d3-format' +
		'|d3-interpolate' +
		'|d3-scale' +
		'|d3-time' +
		'|d3-time-format' +
		'|internmap' +
		'|react-native-fs' +
		'|@react-navigation)/)'
	],
	coverageReporters: ['html', 'json', 'lcov', 'text'],
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	preset: 'react-native',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	// TODO: remove custom transform once the react-native preset is fixed for RN v0.76, maybe?
	transform: {
		'^.+\\.(js)$': ['babel-jest', { plugins: ['babel-plugin-syntax-hermes-parser'] }],
		'^.+\\.(ts|tsx)$': 'babel-jest',
	},
};

export default config;
