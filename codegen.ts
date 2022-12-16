import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'schema.graphql',
	documents: './src/**/*.graphql',
	hooks: {
		afterOneFileWrite: ['yarn eslint --fix', 'yarn run codegen:add-header --']
	},
	generates: {
		'./src/services/queries/_types.ts': {
			plugins: ['typescript'],
			config: {
				preResolveTypes: true,
				namingConvention: 'keep',
				inlineFragmentTypes: 'inline',
				avoidOptionals: {
					field: false
				},
				onlyEnums: false,
				skipTypeNameForRoot: true,
				nonOptionalTypename: true,
				withHooks: false,
				useTypeImports: false,
				dedupeFragments: false,
				withResultType: false,
				skipTypename: true,
				strictScalars: false,
				withHOC: false
			}
		},
		'./src/': {
			preset: 'near-operation-file', // Tells codegen to generate multiple files instead of one
			presetConfig: {
				extension: '.api.ts',
				baseTypesPath: './services/queries/_types.ts', // # Points to the base types file
			},
			config: {
				withHooks: false,
				skipTypename: true
			},
			plugins: ['typescript-operations', 'typescript-react-apollo'] // Generates types based on your operations
		}
	}
};

export default config;
