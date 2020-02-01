module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"@react-native-community",
		"airbnb-typescript"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
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
		"prettier/prettier": 0,
		"comma-dangle": ["error", {"functions": "ignore"}],
		"react/no-did-mount-set-state": 0,
		"react/no-did-update-set-state": 0,
		"indent": "off",
		"no-tabs": "off",
		"import/no-unresolved": "off",
		"import/extensions": "off",
		"padded-blocks": "off",
		"arrow-parens": "off",
		"react/jsx-boolean-value": 0,
		"lines-between-class-members": "off",
		"class-methods-use-this": "off",
		"no-console": ["error", {allow: ["warn", "error"]}],
		"import/prefer-default-export": "off",
		"@typescript-eslint/indent": ["error", "tab"],
		"max-len": ["error", 200],
		"object-curly-spacing": "off",
		"react/state-in-constructor": "off",
		"react/jsx-indent": [1, 'tab'],
		"react/jsx-indent-props": [1, 'tab'],
		"consistent-return": 'off',
		"react/destructuring-assignment": [0, "always", {"ignoreClassFields": true}],
		"react/jsx-tag-spacing": 0,
		"@typescript-eslint/camelcase": "off",
		"object-curly-newline": ["error", {ImportDeclaration: "never"}],
		"react/static-property-placement": 0,
		"react/jsx-props-no-spreading": 0,
		"@typescript-eslint/member-delimiter-style": 0,
		"@typescript-eslint/no-empty-interface": 0,
		"react/sort-comp": 0,
		"@typescript-eslint/no-inferrable-types": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/interface-name-prefix": 0,
		"@typescript-eslint/explicit-function-return-type": "off"
	},
	"overrides": [
		{
			// enable the rule specifically for TypeScript files
			"files": ["*.ts", "*.tsx"],
			"rules": {
				"@typescript-eslint/explicit-function-return-type": ["error"],
				"no-await-in-loop": 0,
				"no-restricted-syntax": 0
			}
		}
	]
};
