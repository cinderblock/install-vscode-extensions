#!/usr/bin/env node

const path = require('path');
const which = require('which');
const child_process = require('child_process');

const extensions = path.resolve(process.cwd(), '.vscode', 'extensions.json');

let req;

try {
  req = require(extensions);
} catch (e) {
  console.log('Could not open extensions file:', extensions);
  return;
}

const { recommendations } = req;

if (!recommendations) {
  console.log('No recomendation in file');
  return;
}

const binary = which.sync('code', { nothrow: true });
if (!binary) {
  console.log('VS Code not found');
  return;
}

const installExt = '--install-extension';

const args = recommendations.reduce((args, rec) => {
  args.push(installExt);
  args.push(rec);
  return args;
}, []);

const vscode = child_process.spawn(binary, args);

vscode.stdout.on('data', data => process.stdout.write(data));
vscode.stderr.on('data', data => process.stderr.write(data));
