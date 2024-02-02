module.exports = {
	'preset': 'react-native',
	'transformIgnorePatterns': [
		'node_modules/(?!(' +
		'react-native' +
		'|@react-native' +
		'|@kesha-antonov/react-native-background-downloader' +
		'|react-native-snackbar' +
		'|react-native-reanimated' +
		'|react-native-status-bar-height' +
		'|react-native-floating-action' +
		'|react-native-track-player' +
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
	'setupFilesAfterEnv': [
		'./jest.setup.js',
		'./node_modules/react-native-gesture-handler/jestSetup.js'
	]
};
