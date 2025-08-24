import fs from "node:fs";

try {
	const args = process.argv;
	const data = fs.readFileSync(args[2], "utf8");
	let result = `// @generated
// This file was automatically generated and should not be edited.

${data}`
		.replace(/export type (\w+Query) =/g, "export interface $1")
		.replaceAll("Apollo.QueryResult<", "useQuery.Result<");
	if (result.includes("MutationFunction")) {
		result = result.replaceAll("import * as Apollo from '@apollo/client';", "import { useMutation, useQuery } from '@apollo/client/react';")
			.replaceAll("Apollo.MutationFunction<", "useMutation.MutationFunction<")
			.replaceAll("Apollo.MutationResult<", "useMutation.Result<")
			.replaceAll("Apollo.BaseMutationOptions<", "useMutation.MutationFunctionOptions<");
	} else {
		result = result.replaceAll("import * as Apollo from '@apollo/client';", "import { useQuery } from '@apollo/client/react';");
	}
	fs.writeFileSync(args[2], result);
} catch (error) {
	console.error(error);
}
