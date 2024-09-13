import fs from 'node:fs';

try {
	const args = process.argv;
	console.log(args);
	const data = fs.readFileSync(args[2], 'utf8');
	const front = `// @generated
// This file was automatically generated and should not be edited.

`;
	fs.writeFileSync(args[2], front + data);
	// console.log(data);
} catch (err) {
	console.error(err);
}
