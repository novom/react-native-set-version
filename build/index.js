#!/usr/bin/env node
"use strict";

var _manifestAndroid = _interopRequireDefault(require("manifest-android"));

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _versionUtils = require("./versionUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const display = console.log; // eslint-disable-line no-console

const paths = {
  packageJson: './package.json',
  buildGradle: './android/app/build.gradle',
  androidManifest: './android/app/src/main/AndroidManifest.xml'
};

const loadManifest = (manifest, filePath) => new Promise((resolve, reject) => {
  manifest.load(filePath, (err, man) => {
    if (err) {
      return reject(err);
    }

    return resolve(man);
  });
});

function versionPackage(versionText) {
  let packageJSON = null;

  try {
    packageJSON = JSON.parse(_fs.default.readFileSync(paths.packageJson));
    packageJSON.version = versionText;

    _fs.default.writeFileSync(paths.packageJson, `${JSON.stringify(packageJSON, null, '\t')}\n`);

    display(_chalk.default.green(`Version replaced in ${_chalk.default.bold('package.json')}`));
  } catch (err) {
    display(_chalk.default.red(`ERROR: Cannot find file with name ${_path.default.resolve(paths.packageJson)}`));
    process.exit(1);
  }

  return packageJSON;
}

async function getAndroidVersionInfo(versionText) {
  let versionInfo = {
    currentVersionCode: null,
    currentVersion: null,
    version: null,
    versionCode: null
  };

  try {
    const manifest = await loadManifest(new _manifestAndroid.default(), {
      file: paths.androidManifest
    });
    const currentVersion = (0, _versionUtils.versionStringToVersion)(manifest._xml.attributes['android:versionName']); // eslint-disable-line no-underscore-dangle

    const currentVersionCode = +manifest._xml.attributes['android:versionCode']; // eslint-disable-line no-underscore-dangle

    const version = (0, _versionUtils.versionStringToVersion)(versionText, currentVersion, currentVersionCode);
    versionInfo = {
      currentVersionCode,
      currentVersion,
      version,
      versionCode: (0, _versionUtils.versionToVersionCode)(version)
    };
  } catch (err) {
    display(_chalk.default.yellowBright(`WARNING: Cannot find attribute android:versionCode in file ${_path.default.resolve(paths.buildGradle)}. Android version configuration will be skipped`));
  }

  return versionInfo;
}

function versionAndroid(versionText, versionCode) {
  if (versionCode) {
    try {
      const buildGradle = _fs.default.readFileSync(paths.buildGradle, 'utf8');

      const newBuildGradle = buildGradle.replace(/versionCode \d+/g, `versionCode ${versionCode}`).replace(/versionName "[^"]*"/g, `versionName "${versionText}"`);

      _fs.default.writeFileSync(paths.buildGradle, newBuildGradle, 'utf8');

      display(_chalk.default.green(`Version replaced in ${_chalk.default.bold('build.gradle')}`));
    } catch (err) {
      display(_chalk.default.yellowBright(`WARNING: Cannot find file with name ${_path.default.resolve(paths.buildGradle)}. this file is skipped`));
    }

    try {
      const androidManifest = _fs.default.readFileSync(paths.androidManifest, 'utf8');

      const newAndroidManifest = androidManifest.replace(/android:versionCode="\d*"/g, `android:versionCode="${versionCode}"`).replace(/android:versionName="[^"]*"/g, `android:versionName="${versionText}"`);

      _fs.default.writeFileSync(paths.androidManifest, newAndroidManifest, 'utf8');

      display(_chalk.default.green(`Version replaced in ${_chalk.default.bold('AndroidManifest.xml')}`));
    } catch (err) {
      display(_chalk.default.yellowBright(`WARNING: Cannot find file with name ${_path.default.resolve(paths.androidManifest)}. this file is skipped`));
    }
  }
}

const changeVersion = async () => {
  const versionText = process.argv[2];
  display('');
  const {
    version,
    versionCode
  } = await getAndroidVersionInfo(versionText);
  display(_chalk.default.yellow('Android version info:'));
  display(version); // eslint-disable-line no-console

  display('');
  display(_chalk.default.yellow(`Will set version to ${_chalk.default.bold.underline(versionText)}`));
  display(_chalk.default.yellow(`Will set android version code to ${_chalk.default.bold.underline(versionCode)}`));
  display('');
  const appName = versionPackage(versionText).name;
  versionAndroid(versionText, versionCode);
  display('');
  display(_chalk.default.cyan.bold.underline('Do not forget to change your snapshots to reflect your new version number'));
  display('');
};

changeVersion();