// eslint-disable-next-line unicorn/prefer-module
const path = require("node:path");
// eslint-disable-next-line unicorn/prefer-module
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

// eslint-disable-next-line unicorn/prefer-module
const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import("@react-native/metro-config").MetroConfig}
 */
const config = {
	transformer: {
		assetRegistryPath: "react-native/Libraries/Image/AssetRegistry"
	},
	resolver: {
		extraNodeModules: {
			// eslint-disable-next-line unicorn/prefer-module
			"react-native/asset-registry": require.resolve("react-native/Libraries/Image/AssetRegistry")
		},
		blockList: [
			// Prevent Metro from resolving packages from nested node_modules
			// inside local-path dependencies (e.g. react-native-track-player)
			new RegExp(
				// eslint-disable-next-line unicorn/prefer-module
				path.resolve(__dirname, "node_modules/react-native-track-player/node_modules/.*").replace(/[/\\]/g, String.raw`[/\\]`)
			)
		]
	}
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = mergeConfig(defaultConfig, config);
