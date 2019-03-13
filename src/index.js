#!/usr/bin/env node

import AndroidManifest from 'manifest-android';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import { versionStringToVersion, versionToVersionCode } from './versionUtils';

const display = console.log; // eslint-disable-line no-console

const paths = {
  packageJson: './package.json',
  buildGradle: './android/app/build.gradle',
  androidManifest: './android/app/src/main/AndroidManifest.xml',
};

const loadManifest = (manifest, filePath) => (
  new Promise((resolve, reject) => {
    manifest.load(filePath, (err, man) => {
      if (err) {
        return reject(err);
      }
      return resolve(man);
    });
  })
);

function versionPackage(versionText) {
  let packageJSON = null;
  try {
    packageJSON = JSON.parse(fs.readFileSync(paths.packageJson));
    packageJSON.version = versionText;
    fs.writeFileSync(paths.packageJson, `${JSON.stringify(packageJSON, null, '\t')}\n`);
    display(chalk.green(`Version replaced in ${chalk.bold('package.json')}`));
  } catch {
    display(chalk.red(`ERROR: Cannot find file with name ${path.resolve(paths.packageJson)}. package.json and ios/<project-name>/info.plist will be skipped`));
  }
  return packageJSON;
}

const changeVersion = async () => {
  const versionText = process.argv[2];
  const manifest = await loadManifest(new AndroidManifest(), { file: paths.androidManifest });
  const currentVersionCode = +(manifest._xml.attributes['android:versionCode']); // eslint-disable-line no-underscore-dangle
  const currentVersion = versionStringToVersion(manifest._xml.attributes['android:versionName']); // eslint-disable-line no-underscore-dangle
  const version = versionStringToVersion(versionText, currentVersion, currentVersionCode);

  const versionCode = versionToVersionCode(version);


  display('');

  display(chalk.yellow('Version info:'));
  display(version); // eslint-disable-line no-console

  display('');

  display(chalk.yellow(`Will set version to ${chalk.bold.underline(versionText)}`));
  display(chalk.yellow(`Will set version code to ${chalk.bold.underline(versionCode)}`));

  display('');

  const appName = versionPackage().name;

  const buildGradle = fs.readFileSync(paths.buildGradle, 'utf8');

  const newBuildGradle = buildGradle.replace(/versionCode \d+/g, `versionCode ${versionCode}`)
    .replace(/versionName "[^"]*"/g, `versionName "${versionText}"`);

  fs.writeFileSync(paths.buildGradle, newBuildGradle, 'utf8');
  display(chalk.green(`Version replaced in ${chalk.bold('build.gradle')}`));

  const androidManifest = fs.readFileSync(paths.androidManifest, 'utf8');

  const newAndroidManifest = androidManifest.replace(/android:versionCode="\d*"/g, `android:versionCode="${versionCode}"`)
    .replace(/android:versionName="[^"]*"/g, `android:versionName="${versionText}"`);

  fs.writeFileSync(paths.androidManifest, newAndroidManifest, 'utf8');
  display(chalk.green(`Version replaced in ${chalk.bold('AndroidManifest.xml')}`));

  display('');

  display(chalk.cyan.bold.underline('Do not forget to change your snapshots to reflect your new version number'));

  display('');
};

changeVersion();
