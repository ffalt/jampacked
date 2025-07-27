// eslint-disable-next-line unicorn/prefer-module
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
	* Metro configuration
	* https://reactnative.dev/docs/metro
	*
	* @type {import("@react-native/metro-config").MetroConfig}
	*/
const config = {};

// eslint-disable-next-line unicorn/prefer-module
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
