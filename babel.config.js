
// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {createRequire} = require('module');

const rnRequire = createRequire(require.resolve('react-native'));

module.exports = {
	// RN bundles this preset, so let's load it instead of depending on it ourselves
	presets: [rnRequire.resolve('@react-native/babel-preset')],
	plugins: ['react-native-reanimated/plugin']
};
