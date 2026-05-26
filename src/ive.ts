#!/usr/bin/env node
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { sync as whichSync } from 'which';

interface ExtensionsJson {
  recommendations?: string[];
}

async function main(): Promise<number> {
  const extensionsFile = resolve(process.cwd(), '.vscode', 'extensions.json');

  let parsed: ExtensionsJson;
  try {
    const raw = await readFile(extensionsFile, 'utf8');
    parsed = stripJsonComments(raw);
  } catch (err) {
    console.error(`Could not read extensions file: ${extensionsFile}`);
    console.error((err as Error).message);
    return 1;
  }

  const recommendations = parsed.recommendations;
  if (!recommendations || recommendations.length === 0) {
    console.error(`No "recommendations" in ${extensionsFile}`);
    return 1;
  }

  const binary = whichSync('code', { nothrow: true });
  if (!binary) {
    console.error('VS Code CLI ("code") not found on PATH');
    return 1;
  }

  const args = recommendations.flatMap(ext => ['--install-extension', ext]);
  const child = spawn(binary, args, { stdio: 'inherit' });

  return new Promise<number>((resolveFn, rejectFn) => {
    child.on('error', rejectFn);
    child.on('exit', (code, signal) => {
      if (signal) {
        console.error(`code exited via signal ${signal}`);
        resolveFn(1);
      } else {
        resolveFn(code ?? 0);
      }
    });
  });
}

// VS Code's extensions.json allows both line and block comments. Parse permissively.
function stripJsonComments(raw: string): ExtensionsJson {
  // Remove block comments first, then line comments. Keep it simple — the
  // file is small and we don't need full JSON5 semantics.
  const noBlock = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  const noLine = noBlock.replace(/^\s*\/\/.*$/gm, '');
  return JSON.parse(noLine);
}

main().then(
  code => process.exit(code),
  err => {
    console.error(err);
    process.exit(1);
  },
);
