import { readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const IGNORED_DIRS = new Set([
  '.git',
  '.vercel',
  'node_modules',
  'coverage',
  'dist',
  'build'
]);
const JS_EXTENSIONS = new Set(['.js', '.mjs']);

async function collectJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...await collectJavaScriptFiles(fullPath));
      }
      continue;
    }

    if (entry.isFile() && JS_EXTENSIONS.has(extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = (await collectJavaScriptFiles(ROOT)).sort((a, b) => a.localeCompare(b));
const failures = [];

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    cwd: ROOT,
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    failures.push({
      file: relative(ROOT, file),
      output: `${result.stdout || ''}${result.stderr || ''}`.trim()
    });
  }
}

if (failures.length) {
  console.error(`Foram encontrados ${failures.length} arquivo(s) JavaScript com erro de sintaxe:`);
  failures.forEach(({ file, output }) => {
    console.error(`\n- ${file}`);
    if (output) console.error(output);
  });
  process.exit(1);
}

console.log(`Verificação JavaScript concluída: ${files.length} arquivo(s) .js/.mjs válidos.`);
