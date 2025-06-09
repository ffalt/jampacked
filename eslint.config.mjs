import js from "@eslint/js";
import ts from 'typescript-eslint';
import {fixupPluginRules} from '@eslint/compat'
import reactNative from 'eslint-plugin-react-native';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
	js.configs.recommended, // Recommended config applied to all files
	...ts.configs.recommended,
	jest.configs['flat/recommended'],
	{
		plugins: {
			react,
			'react-native': fixupPluginRules(reactNative),
			'react-hooks': fixupPluginRules(reactHooks),
		}
	},
	{
		ignores: [
			"src/services/queries/*.api.ts",
			"src/services/jam",
			"**/babel.config.js",
			"**/codegen.ts",
			"**/codegen.hook.mjs",
			"**/jest.transformer.js",
			"**/eslint.config.mjs",
			"**/wdyr.js",
			"**/metro.config.js",
			"**/.yarn/",
			"**/node_modules/",
			"**/ios/",
			"**/android/",
			"**/local/",
			"**/__mocks__",
		],
	},
	{
		files: [
			'**/*.test.ts?(x)',
		],
		...testingLibrary.configs['flat/react-native'],
		rules: {
			"testing-library/no-container": "off",
			"no-console": "off"
		}
	},
	{
		files: ["**/*.ts", "**/*.tsx"],

		rules: {
			"no-shadow": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					// "args": "all",
					"argsIgnorePattern": "^_",
					// "caughtErrors": "all",
					"caughtErrorsIgnorePattern": "^_",
					// "destructuredArrayIgnorePattern": "^_",
					"varsIgnorePattern": "^_",
					// "ignoreRestSiblings": true
				}
			],
			"react/destructuring-assignment": [0, "always", {
				ignoreClassFields: true,
			}],
			"@typescript-eslint/no-explicit-any": "off",
			"react/jsx-no-undef": 1,
			"react/jsx-indent": [1, "tab"],
			"react/jsx-indent-props": [1, "tab"],
			"react/no-did-mount-set-state": "off",
			"react/no-did-update-set-state": "off",
			"react/state-in-constructor": "off"
		},
	}];
