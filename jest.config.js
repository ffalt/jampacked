module.exports = {
	preset: 'react-native',
	moduleFileExtensions: [
		'ts',
		'tsx',
		'json',
		'jsx',
		'js'
	],
	transform: {
		'\\.(js)$': 'babel-jest',
		'\\.(ts|tsx)$': 'babel-jest'
	},
	moduleNameMapper: {
		'\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest.transformer.js'
	},
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	// testPathIgnorePatterns: [
	// 	'\\.snap$',
	// 	'<rootDir>/node_modules/'
	// ],
	transformIgnorePatterns: [
		'node_modules/(?!(@react-native'
		+ '|react-native'
		+ '|react-navigation-tabs'
		+ '|react-native-splash-screen'
		+ '|react-native-screens'
		+ '|react-native-reanimated'
		+ '|react-native-snackbar'
		+ '|react-native-fs'
		+ '|react-native-status-bar-height'
		+ '|react-native-linear-gradient'
		+ '|react-native-actions-sheet'
		+ '|react-native-background-downloader'
		+ '|react-native-background-timer'
		+ ')/)'],
	setupFiles: [
		'./node_modules/react-native-gesture-handler/jestSetup.js',
		'./__mocks__/jestSetup.js'
	]
};
