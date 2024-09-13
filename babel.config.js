
// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.

// eslint-disable-next-line @typescript-eslint/no-require-imports,no-undef
const {createRequire} = require('module');

// eslint-disable-next-line no-undef
const rnRequire = createRequire(require.resolve('react-native'));

// eslint-disable-next-line no-undef
module.exports = {
	// RN bundles this preset, so let's load it instead of depending on it ourselves
	presets: [rnRequire.resolve('@react-native/babel-preset')],
	plugins: []
};
