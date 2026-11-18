#!/usr/bin/env node
// Usage: node schema/sync-graphql-schema.js [--check] [--build]
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'schema/jam.schema.graphql');
const target = path.join(root, 'app/src/main/graphql/org/ffalt/jampacked/schema.graphqls');
const args = new Set(process.argv.slice(2));

function stripDocs(text) {
    return text.replace(/"""[\s\S]*?"""/g, '').replace(/#.*$/gm, '');
}

function parse(text) {
    const result = new Map();
    const header = /^(extend\s+)?(type|input|interface|enum|union|scalar|directive)\s+(\S+)[^{\n]*(\{)?/gm;
    const clean = stripDocs(text);
    let m;
    while ((m = header.exec(clean))) {
        const key = `${m[2]} ${m[3]}`;
        const fields = new Map();
        if (m[4]) {
            let depth = 1, i = header.lastIndex;
            const start = i;
            while (depth > 0 && i < clean.length) {
                if (clean[i] === '{') depth++;
                else if (clean[i] === '}') depth--;
                i++;
            }
            const body = clean.slice(start, i - 1);
            let paren = 0, current = '';
            const entries = [];
            for (const ch of body) {
                if (ch === '(') paren++;
                if (ch === ')') paren--;
                if (ch === '\n' && paren === 0) {
                    if (current.trim()) entries.push(current.trim());
                    current = '';
                } else current += ch;
            }
            if (current.trim()) entries.push(current.trim());
            for (const e of entries) {
                const sig = e.replace(/\s+/g, ' ');
                const name = sig.match(/^[A-Za-z_][A-Za-z0-9_]*/)?.[0] ?? sig;
                fields.set(name, sig);
            }
            header.lastIndex = i;
        }
        result.set(key, fields);
    }
    return result;
}

const newText = fs.readFileSync(source, 'utf8');
const oldText = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
const oldTypes = parse(oldText);
const newTypes = parse(newText);
const lines = [];

for (const [key, fields] of newTypes) {
    if (!oldTypes.has(key)) {
        lines.push(`+ ${key} (new)`);
        continue;
    }
    const old = oldTypes.get(key);
    for (const [name, sig] of fields) {
        if (!old.has(name)) lines.push(`+ ${key}.${name}: ${sig}`);
        else if (old.get(name) !== sig) lines.push(`~ ${key}.${name}: ${old.get(name)}  ->  ${sig}`);
    }
    for (const name of old.keys()) if (!fields.has(name)) lines.push(`- ${key}.${name}`);
}
for (const key of oldTypes.keys()) if (!newTypes.has(key)) lines.push(`- ${key} (removed)`);

if (oldText === newText) {
    console.log('Schema already up to date.');
    process.exit(0);
}
console.log(lines.length ? lines.join('\n') : 'Only formatting/docs/ordering changes.');

if (args.has('--check')) {
    console.log('\n--check: nothing written.');
    process.exit(1);
}
fs.writeFileSync(target, newText);
console.log(`\nUpdated ${path.relative(root, target)}`);

if (args.has('--build')) {
    const r = spawnSync('./gradlew', [':app:generateApolloSources'], {cwd: root, stdio: 'inherit'});
    process.exit(r.status ?? 1);
}
