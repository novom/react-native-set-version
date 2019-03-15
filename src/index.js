#!/usr/bin/env node

import AndroidManifest from 'manifest-android';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import plist from 'plist';

import { versionStringToVersion, versionToVersionCode } from './versionUtils';

const display = console.log; // eslint-disable-line no-console

const paths = {
  packageJson: './package.json',
  buildGradle: './android/app/build.gradle',
  androidManifest: './android/app/src/main/AndroidManifest.xml',
  infoPlist: './ios/<APP_NAME>/Info.plist',
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
    display(chalk.yellow(`Will set package version to ${chalk.bold.underline(versionText)}`));
    packageJSON.version = versionText;
    fs.writeFileSync(paths.packageJson, `${JSON.stringify(packageJSON, null, '\t')}\n`);
    display(chalk.green(`Version replaced in ${chalk.bold('package.json')}`));
  } catch (err) {
    display(chalk.red(`${chalk.bold.underline('ERROR:')} Cannot find file with name ${path.resolve(paths.packageJson)}`));
    process.exit(1);
  }
  return packageJSON;
}


function getIOSVersionInfo(versionText) {
  let versionInfo = {
    currentVersionCode: null,
    currentVersion: null,
    version: null,
    versionCode: null,
  };

  try {
    const plistInfo = plist.parse(fs.readFileSync(paths.infoPlist, 'utf8'));
    const currentVersion = versionStringToVersion(plistInfo.CFBundleShortVersionString);
    const versionCodeParts = plistInfo.CFBundleVersion.toString().split('.');
    const currentVersionCode = +(versionCodeParts[versionCodeParts.length - 1]);
    const version = versionStringToVersion(versionText, currentVersion, currentVersionCode);
    versionInfo = {
      currentVersionCode,
      currentVersion,
      version,
      versionCode: version.build,
    };
  } catch (err) {
    display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find key CFBundleShortVersionString in file ${path.resolve(paths.infoPlist)}. IOS version configuration will be skipped`));
  }
  return versionInfo;
}

async function versionIOS(versionText) {
  const { version } = await getIOSVersionInfo(versionText);
  const bundleVersion = `${version.major}.${version.minor}.${version.patch}.${version.build}`;
  if (version) {
    display('');
    display(chalk.yellow('IOS version info:'));
    display(version);

    display('');

    display(chalk.yellow(`Will set CFBundleShortVersionString to ${chalk.bold.underline(versionText)}`));
    display(chalk.yellow(`Will set CFBundleVersion to ${chalk.bold.underline(bundleVersion)}`));
    try {
      const plistInfo = plist.parse(fs.readFileSync(paths.infoPlist, 'utf8'));
      plistInfo.CFBundleShortVersionString = versionText;
      plistInfo.CFBundleVersion = bundleVersion;
      fs.writeFileSync(paths.infoPlist, plist.build(plistInfo), 'utf8');
      display(chalk.green(`Version replaced in ${chalk.bold('Info.plist')}`));
    } catch (err) {
      display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find file with name ${path.resolve(paths.infoPlist)}. this file is skipped`));
    }
  }
}

async function getAndroidVersionInfo(versionText) {
  let versionInfo = {
    currentVersionCode: null,
    currentVersion: null,
    version: null,
    versionCode: null,
  };
  try {
    const manifest = await loadManifest(new AndroidManifest(), { file: paths.androidManifest });
    const currentVersion = versionStringToVersion(manifest._xml.attributes['android:versionName']); // eslint-disable-line no-underscore-dangle
    const currentVersionCode = +(manifest._xml.attributes['android:versionCode']); // eslint-disable-line no-underscore-dangle
    const version = versionStringToVersion(versionText, currentVersion, currentVersionCode);
    versionInfo = {
      currentVersionCode,
      currentVersion,
      version,
      versionCode: versionToVersionCode(version),
    };
  } catch (err) {
    display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find attribute android:versionCode in file ${path.resolve(paths.buildGradle)}. Android version configuration will be skipped`));
  }
  return versionInfo;
}

async function versionAndroid(versionText) {
  const { version, versionCode } = await getAndroidVersionInfo(versionText);

  if (versionCode) {
    display('');
    display(chalk.yellow('Android version info:'));
    display(version);

    display('');

    display(chalk.yellow(`Will set android version to ${chalk.bold.underline(versionText)}`));
    display(chalk.yellow(`Will set android version code to ${chalk.bold.underline(versionCode)}`));
    try {
      const buildGradle = fs.readFileSync(paths.buildGradle, 'utf8');
      const newBuildGradle = buildGradle.replace(/versionCode \d+/g, `versionCode ${versionCode}`)
        .replace(/versionName "[^"]*"/g, `versionName "${versionText}"`);

      fs.writeFileSync(paths.buildGradle, newBuildGradle, 'utf8');
      display(chalk.green(`Version replaced in ${chalk.bold('build.gradle')}`));
    } catch (err) {
      display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find file with name ${path.resolve(paths.buildGradle)}. this file is skipped`));
    }

    try {
      const androidManifest = fs.readFileSync(paths.androidManifest, 'utf8');

      const newAndroidManifest = androidManifest.replace(/android:versionCode="\d*"/g, `android:versionCode="${versionCode}"`)
        .replace(/android:versionName="[^"]*"/g, `android:versionName="${versionText}"`);

      fs.writeFileSync(paths.androidManifest, newAndroidManifest, 'utf8');
      display(chalk.green(`Version replaced in ${chalk.bold('AndroidManifest.xml')}`));
    } catch (err) {
      display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find file with name ${path.resolve(paths.androidManifest)}. this file is skipped`));
    }
  }
}

const changeVersion = async () => {
  const versionText = process.argv[2];

  const appName = versionPackage(versionText).name;

  paths.infoPlist = paths.infoPlist.replace('<APP_NAME>', appName);

  await versionAndroid(versionText);

  await versionIOS(versionText);

  display('');

  display(chalk.cyan.bold.underline('Do not forget to change your snapshots to reflect your new version number'));

  display('');
};

changeVersion();
