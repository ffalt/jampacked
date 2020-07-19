module.exports = {
	preset: 'react-native',
	moduleFileExtensions: [
		'ts',
		'tsx',
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
	testPathIgnorePatterns: [
		'\\.snap$',
		'<rootDir>/node_modules/'
	],
	setupFiles: [
		'./node_modules/react-native-gesture-handler/jestSetup.js'
	]
};
