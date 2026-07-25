import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', '.npm-cache', 'assets', 'node_modules']);
const checkedExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.mjs', '.yml', '.yaml']);
const errors = [];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath));
    } else if (checkedExtensions.has(extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

for (const file of await collectFiles(root)) {
  const content = await readFile(file, 'utf8');
  const displayPath = relative(root, file).replaceAll('\\', '/');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (/[ \t]+$/.test(line)) {
      errors.push(`${displayPath}:${index + 1} contém espaço em branco no fim da linha`);
    }
  });

  if (content.length > 0 && !content.endsWith('\n')) {
    errors.push(`${displayPath} deve terminar com uma quebra de linha`);
  }
}

if (errors.length > 0) {
  console.error('Foram encontrados problemas de formatação:\n');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Verificação de espaços e finais de linha concluída sem erros.');
