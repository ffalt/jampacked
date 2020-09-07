module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"@react-native-community"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	ignorePatterns: [
		'src/services/queries/types',
		'src/services/jam',
		'wdyr.js',
		'.eslintrc.js'
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
		project: "./tsconfig.eslint.json",
		tsconfigRootDir: __dirname,
	},
	globals: {
		fetch: false,
		__DEV__: false,
		requestIdleCallback: false,
		requestAnimationFrame: false
	},
	settings: {
		react: {
			version: "detect",
		},
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx"]
			},
		},
	},
	rules: {
		"comma-dangle": ["error", {"functions": "ignore"}],
		"max-len": ["error", 200],
		"no-console": ["error", {allow: ["warn", "error"]}],
		"object-curly-newline": ["error", {ImportDeclaration: "never"}],
		"prettier/prettier": "off",
		"react/destructuring-assignment": [0, "always", {"ignoreClassFields": true}],
		"react/jsx-indent": [1, 'tab'],
		"react/jsx-indent-props": [1, 'tab'],
		"react/no-did-mount-set-state": "off",
		"react/no-did-update-set-state": "off",
		"react/state-in-constructor": "off"
	},
	"overrides": [
		{
			// enable the rule specifically for TypeScript files
			"files": ["*.ts", "*.tsx"],
			"rules": {
				"@typescript-eslint/indent": ["error", "tab"],
				"@typescript-eslint/no-inferrable-types": "off",
				// "@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/explicit-function-return-type": ["error"],
				"@typescript-eslint/explicit-module-boundary-types": "off"
			}
		}
	]
};
