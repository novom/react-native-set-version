#!/usr/bin/env node
"use strict";

var _manifestAndroid = _interopRequireDefault(require("manifest-android"));

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var _versionUtils = require("./versionUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const paths = {
  packageJson: './package.json',
  buildGradle: './android/app/build.gradle',
  androidManifest: './android/app/src/main/AndroidManifest.xml'
};

const loadManifest = (manifest, path) => new Promise((resolve, reject) => {
  manifest.load(path, (err, man) => {
    if (err) {
      return reject(err);
    }

    return resolve(man);
  });
});

const changeVersion = async () => {
  const display = console.log; // eslint-disable-line no-console

  const versionText = process.argv[2];
  const manifest = await loadManifest(new _manifestAndroid.default(), {
    file: paths.androidManifest
  });
  const currentVersionCode = +manifest._xml.attributes['android:versionCode']; // eslint-disable-line no-underscore-dangle

  const currentVersion = (0, _versionUtils.versionStringToVersion)(manifest._xml.attributes['android:versionName']); // eslint-disable-line no-underscore-dangle

  const version = (0, _versionUtils.versionStringToVersion)(versionText, currentVersion, currentVersionCode);
  const versionCode = (0, _versionUtils.versionToVersionCode)(version);
  display('');
  display(_chalk.default.yellow('Version info:'));
  display(version); // eslint-disable-line no-console

  display('');
  display(_chalk.default.yellow(`Will set version to ${_chalk.default.bold.underline(versionText)}`));
  display(_chalk.default.yellow(`Will set version code to ${_chalk.default.bold.underline(versionCode)}`));
  display('');
  const packageJSON = JSON.parse(_fs.default.readFileSync(paths.packageJson));
  packageJSON.version = versionText;

  _fs.default.writeFileSync(paths.packageJson, `${JSON.stringify(packageJSON, null, '\t')}\n`);

  display(_chalk.default.green(`Version replaced in ${_chalk.default.bold('package.json')}`));

  const buildGradle = _fs.default.readFileSync(paths.buildGradle, 'utf8');

  const newBuildGradle = buildGradle.replace(/versionCode \d+/g, `versionCode ${versionCode}`).replace(/versionName "[^"]*"/g, `versionName "${versionText}"`);

  _fs.default.writeFileSync(paths.buildGradle, newBuildGradle, 'utf8');

  display(_chalk.default.green(`Version replaced in ${_chalk.default.bold('build.gradle')}`));

  const androidManifest = _fs.default.readFileSync(paths.androidManifest, 'utf8');

  const newAndroidManifest = androidManifest.replace(/android:versionCode="\d*"/g, `android:versionCode="${versionCode}"`).replace(/android:versionName="[^"]*"/g, `android:versionName="${versionText}"`);

  _fs.default.writeFileSync(paths.androidManifest, newAndroidManifest, 'utf8');

  display(_chalk.default.green(`Version replaced in ${_chalk.default.bold('AndroidManifest.xml')}`));
  display('');
  display(_chalk.default.cyan.bold.underline('Do not forget to change your snapshots to reflect your new version number'));
  display('');
};

changeVersion();