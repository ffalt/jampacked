import eslint from "@eslint/js";
import ts from "typescript-eslint";
import jest from "eslint-plugin-jest";
import globals from "globals";
import reactNative from "eslint-plugin-react-native";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import stylistic from "@stylistic/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";

const commonRules = {
	"arrow-body-style": ["error", "as-needed"],
	"arrow-parens": ["error", "as-needed"],
	"brace-style": ["error", "1tbs"],
	"class-methods-use-this": "off",
	"comma-dangle": "error",
	"complexity": ["error", { max: 20 }],
	"default-case": "error",
	"max-classes-per-file": ["error", 2],
	"max-len": ["error", { code: 240 }],
	"max-lines": ["error", 1000],
	"no-duplicate-case": "error",
	"no-duplicate-imports": "error",
	"no-empty": "error",
	"no-extra-bind": "error",
	"no-invalid-this": "error",
	"no-multiple-empty-lines": ["error", { max: 1 }],
	"no-new-func": "error",
	"no-param-reassign": "error",
	"no-return-await": "error",
	"no-sequences": "error",
	"no-sparse-arrays": "error",
	"no-template-curly-in-string": "error",
	"no-void": "error",
	"prefer-const": "error",
	"prefer-object-spread": "error",
	"prefer-template": "error",
	"space-in-parens": ["error", "never"],
	"yoda": "error"
};

const commonStylisticRules = {
	"@stylistic/semi": ["error", "always"],
	"@stylistic/comma-dangle": ["error", "never"],
	"@stylistic/arrow-parens": ["error", "as-needed"],
	"@stylistic/indent": ["error", "tab"],
	"@stylistic/no-tabs": ["error", { allowIndentationTabs: true }],
	"@stylistic/member-delimiter-style": ["error", {
		"multiline": { "delimiter": "semi", "requireLast": true },
		"singleline": { "delimiter": "semi", "requireLast": false },
		"multilineDetection": "brackets"
	}],
	"@stylistic/quote-props": ["error", "consistent"],
	"@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
	"@stylistic/operator-linebreak": ["error", "after"],
	"@stylistic/type-annotation-spacing": "error",
	"@stylistic/linebreak-style": ["error", "unix"],
	"@stylistic/no-trailing-spaces": "error",
	"@stylistic/indent-binary-ops": ["error", "tab"],
	"@stylistic/jsx-indent-props": ["error", "tab"],
	"@stylistic/jsx-closing-bracket-location": "off"
};

const commonUnicornRules = {
	"unicorn/prefer-top-level-await": "off",
	"unicorn/relative-url-style": "off",
	"unicorn/filename-case": "off",
	"unicorn/no-useless-promise-resolve-reject": "off",
	"unicorn/consistent-function-scoping": "off",
	"unicorn/empty-brace-spaces": "off",
	"unicorn/prefer-query-selector": "off",
	"unicorn/prefer-global-this": "off",
	"unicorn/prefer-ternary": "off",
	"unicorn/no-null": "off",
	"unicorn/prefer-string-replace-all": "off",
	"unicorn/no-useless-undefined": "off",
	"unicorn/prevent-abbreviations": [
		"error",
		{
			"replacements": {
				"env": false,
				"args": false,
				"props": false,
				"db": false,
				"utils": false
			}
		}
	]
};

const commonTypeScriptRules = {
	"@typescript-eslint/no-explicit-any": "off",
	"@typescript-eslint/no-unsafe-function-type": "off",
	"@typescript-eslint/array-type": ["error", { default: "generic" }],
	"@typescript-eslint/await-thenable": "error",
	"@typescript-eslint/ban-ts-comment": "error",
	"@typescript-eslint/consistent-indexed-object-style": "off",
	"@typescript-eslint/consistent-type-definitions": "error",
	"@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
	"@typescript-eslint/naming-convention": "off",
	"@typescript-eslint/no-empty-function": "error",
	"@typescript-eslint/no-empty-object-type": "off",
	"@typescript-eslint/no-floating-promises": "error",
	"@typescript-eslint/no-for-in-array": "error",
	"@typescript-eslint/no-inferrable-types": "off",
	"@typescript-eslint/no-namespace": "error",
	"@typescript-eslint/no-require-imports": "error",
	"@typescript-eslint/no-this-alias": "error",
	"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
	"@typescript-eslint/no-unnecessary-type-arguments": "error",
	"@typescript-eslint/no-unnecessary-type-assertion": "error",
	"@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true }],
	"@typescript-eslint/no-var-requires": "error",
	"@typescript-eslint/prefer-readonly": "error",
	"@typescript-eslint/promise-function-async": "error",
	"@typescript-eslint/restrict-plus-operands": "error",
	"@typescript-eslint/no-unused-vars": [
		"error",
		{
			"args": "all",
			"argsIgnorePattern": "^_",
			"caughtErrors": "all",
			"caughtErrorsIgnorePattern": "^_",
			"destructuredArrayIgnorePattern": "^_",
			"varsIgnorePattern": "^_",
			"ignoreRestSiblings": true
		}
	],
	"@typescript-eslint/require-await": "off",
	"@typescript-eslint/dot-notation": "off",
	"@typescript-eslint/prefer-promise-reject-errors": "off",
	"@typescript-eslint/only-throw-error": "off",
	"@typescript-eslint/no-unsafe-enum-comparison": "off"
};

export default ts.config(
	{
		files: ["**/*.{ts,tsx}"],
		ignores: ["__tests__/", "src/services/queries/*.ts"],
		extends: [
			eslint.configs.recommended,
			...ts.configs.recommendedTypeChecked,
			...ts.configs.stylisticTypeChecked,
			react.configs.flat.recommended,
			reactHooks.configs.flat.recommended,
			unicorn.configs.recommended,
			stylistic.configs.recommended
		],
		plugins: {
			"react": react,
			"react-native": reactNative,
			"unused-imports": unusedImports
		},
		settings: {
			react: {
				version: "19"
			}
		},
		languageOptions: {
			parserOptions: {
				project: ["tsconfig.json"],
				createDefaultProgram: true,
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.reactNative
			}
		},
		rules: {
			...commonRules,
			...commonStylisticRules,
			...commonUnicornRules,
			...commonTypeScriptRules,

			"react-native/no-unused-styles": "error",
			"react-native/split-platform-components": "error",
			"react-native/no-inline-styles": "error",
			"react-native/no-color-literals": "off",
			"react-native/no-raw-text": ["error", { skip: ["ThemedText"] }],
			"react-native/no-single-element-style-arrays": "error",

			"react/display-name": "off",
			"react/prop-types": "off",

			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": ["error", { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }]
		}
	},
	{
		ignores: [
			"**/.yarn/",
			"**/coverage/",
			"**/data/",
			"**/deploy/",
			"**/dist/",
			"**/local/",
			"**/ios/",
			"**/android/",
			"**/node_modules/",
			"**/static/"
		]
	},
	{
		files: ["**/*.{js,mjs,cjs}"],
		extends: [
			eslint.configs.recommended,
			unicorn.configs.recommended,
			stylistic.configs.recommended
		],
		languageOptions: {
			globals: globals.node
		},
		rules: {
			...commonRules,
			...commonStylisticRules,
			...commonUnicornRules,
			"@stylistic/quotes": ["error", "double"]
		}
	},
	{
		files: ["__tests__/**"],
		languageOptions: {
			parserOptions: {
				project: ["tsconfig.json"],
				createDefaultProgram: true,
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.reactNative
			}
		},
		...jest.configs["flat/recommended"],
		extends: [
			eslint.configs.recommended,
			...ts.configs.recommendedTypeChecked,
			...ts.configs.stylisticTypeChecked,
			unicorn.configs.recommended,
			stylistic.configs.recommended
		],
		rules: {
			...commonRules,
			...commonStylisticRules,
			...commonUnicornRules,
			...commonTypeScriptRules,
			...jest.configs["flat/recommended"].rules,
			"jest/expect-expect": "off",
			"jest/no-done-callback": "off"
		}
	},
	{
		files: ["src/services/queries/*.ts"],
		extends: [
			eslint.configs.recommended,
			...ts.configs.recommendedTypeChecked,
			...ts.configs.stylisticTypeChecked,
			unicorn.configs.recommended,
			stylistic.configs.recommended
		],
		plugins: {
			"unused-imports": unusedImports
		},
		settings: {
			react: {
				version: "19"
			}
		},
		languageOptions: {
			parserOptions: {
				project: ["tsconfig.json"],
				createDefaultProgram: true,
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.reactNative
			}
		},
		rules: {
			...commonRules,
			...commonStylisticRules,
			...commonTypeScriptRules,
			...commonUnicornRules,

			"complexity": "off",
			"max-lines": "off",
			"max-len": "off",
			"unicorn/prevent-abbreviations": "off",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": ["error", { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }]
		}
	},
	{
		files: [
			"src/services/jam/model/*.ts",
			"src/services/jam/**/*.service.ts"
		],
		extends: [
			eslint.configs.recommended,
			...ts.configs.recommendedTypeChecked,
			...ts.configs.stylisticTypeChecked,
			unicorn.configs.recommended,
			stylistic.configs.recommended
		],
		languageOptions: {
			parserOptions: {
				project: ["tsconfig.json"],
				createDefaultProgram: true
			}
		},
		rules: {
			...commonRules,
			...commonStylisticRules,
			...commonTypeScriptRules,
			...commonUnicornRules,

			"max-lines": ["error", 2000],
			"unicorn/explicit-length-check": "off",
			"unicorn/prevent-abbreviations": "off",
			"@stylistic/max-statements-per-line": "off",
			"@typescript-eslint/no-namespace": "off"
		}
	}
);
