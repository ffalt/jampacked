import fs from "node:fs";

try {
	const args = process.argv;
	const data = fs.readFileSync(args[2], "utf8");
	const result = `// @generated
// This file was automatically generated and should not be edited.

${data}`
		.replace(/export type (\w+Query) =/g, "export interface $1")
		// .replace("\n\n\n", "\n\n")
		// .replaceAll("\n\n\n", "\n\n")
		// .replaceAll("    `;", "`;")
	;
	fs.writeFileSync(args[2], result);
} catch (error) {
	console.error(error);
}
