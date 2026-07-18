import type { CodegenConfig } from '@graphql-codegen/cli';

const header = `// @generated
// This file was automatically generated and should not be edited.
`;

const scalars = {
	DateTimeISO: 'string',
	JSON: 'unknown'
};

const config: CodegenConfig = {
	overwrite: true,
	schema: 'schema.graphql',
	documents: './src/**/*.graphql',
	hooks: {
		afterOneFileWrite: [
			'prettier --write',
			'eslint --fix'
		]
	},
	generates: {
		'./src/services/queries/_types.ts': {
			plugins: [{ add: { content: header } }, 'typescript'],
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
				useTypeImports: false,
				dedupeFragments: false,
				skipTypename: true,
				strictScalars: true,
				scalars
			}
		},
		'./src/': {
			preset: 'near-operation-file', // Tells codegen to generate multiple files instead of one
			presetConfig: {
				extension: '.api.ts',
				baseTypesPath: './services/queries/_types.ts' // # Points to the base types file
			},
			config: {
				declarationKind: 'interface',
				namingConvention: 'keep',
				preResolveTypes: true,
				inlineFragmentTypes: 'inline',
				avoidOptionals: {
					field: false
				},
				skipTypename: true,
				scalars
			},
			plugins: [{ add: { content: header } }, 'typescript-operations', 'typed-document-node'] // Generates types based on your operations
		}
	}
};

export default config;
