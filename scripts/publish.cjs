#!/usr/bin/env node
// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { execSync } = require('child_process');
const cpx = require('cpx');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const hasLerna = fs.existsSync('lerna.json');

console.log('$ xquery publish', process.argv.slice(2).join(' '));


function execute (cmd, noLog) {
  !noLog && console.log(`$ ${cmd}`);

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    process.exit(-1);
  }
};

function lernaGetVersion () {
  return JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'lerna.json'), 'utf8')
  ).version;
}

function npmGetVersion (noLerna) {
  if (!noLerna && hasLerna) {
    return lernaGetVersion();
  }

  return JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')
  ).version;
}

function npmPublish () {
  if (fs.existsSync('.skip-npm')) {
    return;
  }

  rimraf.sync('dist/package.json');
  ['LICENSE', 'README.md', 'package.json', '.npmrc'].filter((file) => !fs.existsSync(path.join(process.cwd(), 'dist', file))).forEach((file) => cpx.copySync(file, 'dist'));

  process.chdir('dist');


  const tag = npmGetVersion(true).includes('-beta.') ? '--tag beta' : '';
  let count = 1;

  while (true) {
    try {
      execute(`npm publish --access public ${tag}`);
      break;
    } catch (error) {
      if (count < 5) {
        const end = Date.now() + 15000;

        console.error(`Publish failed on attempt ${count}/5. Retrying in 15s`);
        count++;

        while (Date.now() < end) {
          // just spin our wheels
        }
      }
    }
  }

  process.chdir('..');
}

function loopFunc (fn) {
  if (hasLerna) {
    fs
      .readdirSync('packages')
      .filter((dir) => {
        const pkgDir = path.join(process.cwd(), 'packages', dir);

        return fs.statSync(pkgDir).isDirectory() &&
          fs.existsSync(path.join(pkgDir, 'package.json')) &&
          fs.existsSync(path.join(pkgDir, 'dist'));
      })
      .forEach((dir) => {
        process.chdir(path.join('packages', dir));
        fn();
        process.chdir('../..');
      });
  } else {
    fn();
  }
}

loopFunc(npmPublish);
