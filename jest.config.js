module.exports = {
	'preset': 'react-native',
	'transformIgnorePatterns': [
		'node_modules/(?!(' +
		'react-native' +
		'|@react-native' +
		'|react-native-snackbar' +
		'|react-native-status-bar-height' +
		'|react-native-screens' +
		'|react-native-track-player' +
		'|react-native-floating-action' +
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
