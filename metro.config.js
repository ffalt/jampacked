// eslint-disable-next-line unicorn/prefer-module
const path = require("node:path");
// eslint-disable-next-line unicorn/prefer-module
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
	* Metro configuration
	* https://reactnative.dev/docs/metro
	*
	* @type {import("@react-native/metro-config").MetroConfig}
	*/
const config = {
	resolver: {
		// Prevent Metro from resolving packages from nested node_modules
		// inside local-path dependencies (e.g. react-native-track-player)
		blockList: [
			new RegExp(
				// eslint-disable-next-line unicorn/prefer-module
				path.resolve(__dirname, "node_modules/react-native-track-player/node_modules/.*").replace(/[/\\]/g, String.raw`[/\\]`)
			)
		]
	}
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
