import eslint from '@eslint/js';
import ts from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import globals from 'globals';
import reactNative from 'eslint-plugin-react-native';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import stylistic from '@stylistic/eslint-plugin';
import { configs as reactHooks } from 'eslint-plugin-react-hooks';

export default ts.config(
	{
		ignores: [
			'**/.yarn/',
			'src/services/queries/*.api.ts',
			'src/services/jam/*',
			'**/coverage/',
			'**/data/',
			'**/deploy/',
			'**/dist/',
			'**/local/',
			'**/ios/',
			'**/android/',
			'**/node_modules/',
			'**/static/'
		]
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		extends: [
			eslint.configs.recommended,
			stylistic.configs.customize({
				indent: 'tab',
				quotes: 'single',
				braceStyle: '1tbs',
				semi: true,
				arrowParens: false,
				commaDangle: 'never',
				jsx: false
			})
		],
		languageOptions: {
			globals: globals.node
		},
		rules: {
			'arrow-body-style': ['error', 'as-needed'],
			'arrow-parens': ['error', 'as-needed'],
			'brace-style': ['error', '1tbs'],
			'comma-dangle': 'error',
			'complexity': ['error', { max: 20 }],
			'default-case': 'error',
			'max-classes-per-file': ['error', 2],
			'max-len': ['error', { code: 240 }],
			'max-lines': ['error', 1000],
			'newline-per-chained-call': 'off',
			'no-duplicate-case': 'error',
			'no-duplicate-imports': 'error',
			'no-empty': 'error',
			'no-extra-bind': 'error',
			'no-invalid-this': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'no-new-func': 'error',
			'no-param-reassign': 'error',
			'no-redeclare': 'error',
			'no-return-await': 'error',
			'no-sequences': 'error',
			'no-sparse-arrays': 'error',
			'no-template-curly-in-string': 'error',
			'no-void': 'error',
			'prefer-const': 'error',
			'prefer-object-spread': 'error',
			'prefer-template': 'error',
			'space-in-parens': ['error', 'never'],
			'yoda': 'error'
		}
	},
	{
		files: ['__tests__/**'],
		...jest.configs['flat/recommended'],
		rules: {
			...jest.configs['flat/recommended'].rules,
			'jest/expect-expect': 'off',
			'jest/no-done-callback': 'off'
		}
	},
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			eslint.configs.recommended,
			...ts.configs.recommended,
			...ts.configs.stylistic,
			react.configs.flat.recommended,
			reactHooks['recommended-latest'],
			stylistic.configs.customize({
				indent: 'tab',
				quotes: 'single',
				braceStyle: '1tbs',
				semi: true,
				arrowParens: false,
				commaDangle: 'never',
				jsx: false
			})
		],
		plugins: {
			'react': react,
			'react-native': reactNative,
			'unused-imports': unusedImports,
			'@stylistic': stylistic
		},
		settings: {
			react: {
				version: '19'
			}
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.reactNative
			}
		},
		rules: {
			'react-native/no-unused-styles': 'error',
			'react-native/split-platform-components': 'error',
			'react-native/no-inline-styles': 'error',
			'react-native/no-color-literals': 'off',
			'react-native/no-raw-text': ['error', { skip: ['ThemedText'] }],
			'react-native/no-single-element-style-arrays': 'error',

			'react/display-name': 'off',
			'react/prop-types': 'off',

			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': ['error', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],

			'@stylistic/operator-linebreak': ['error', 'after'],

			'@typescript-eslint/array-type': ['error', { default: 'generic' }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
		},
		ignores: ['__tests__/']
	}
);
