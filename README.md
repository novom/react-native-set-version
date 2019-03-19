# react-native-set-version

 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This tool allows you to easily update the version of a React Native application.
It will update the following files if found:

- **./package.json**
- **./android/app/src/main/AndroidManifest.xml**
- **./android/app/build.gradle**
- **./ios/<app_name>/Info.plist**

## Version number format

In order to use this package, your project version must comply with the format described on [semver.org](https://semver.org/).

## Setup and Usage

There are two ways to install react-native-set-version: globally and locally.

### Local Installation

This is the recommended way to install react-native-set-version.

npm:

```bash
npm install react-native-set-version --save-dev
```

yarn:

```bash
yarn add react-native-set-version --dev
```

You can then use this command in your project directory to run react-native-set-version:

npm:

```bash
$ npm run setVersion <version>
-- or --
$ npm run set-version <version>
```

yarn:

```bash
$ yarn setVersion <version>
-- or --
$ yarn set-version <version>
```

### Global Installation

This installation method allows you to use react-native-set-version in any project.

npm:

```bash
npm install -g react-native-set-version
```

yarn:

```bash
yarn global add react-native-set-version
```

You can then use this command in your project directory to run react-native-set-version:

```bash
setVersion <version>
-- or --
set-version <version>
```

## Behaviour

When invoked, react-native-set-version will make the following changes to your project files:

### Update Package Version

The **version** attribute in `package.json` will be updated with the specified version.

### Update Android Project Version

It will update the **version name** and the **version code** in both `build.gradle` and `AndroidManifest.xml`.

### Update iOS Project Version

It will update the **CFBundleShortVersionString** and the **CFBundleVersion** in `Info.plist`.

### How the version code and CFBundleVersion are updated

The Android version code represents your version number as an integer. This
package uses the following format to generate this integer:

```
<MAJOR><MINOR ON 2 DIGITS><PATCH ON 2 DIGITS><BUILD NUMBER>
```

For instance, the first time you call `set-version 3.1.4`, it will produce the version code `301041`.

If you call the command with the same version a second time, it will increment the build number, to produce `301042`.

This also applies if, for instance, you call `set-version 3.1.4-rc.1`, and then `set-version 3.1.4-rc.2`.

As for the `CFBundleVersion` on iOS, it will produce a string in the format `<MAJOR>.<MINOR>.<PATCH>.<BUILD NUMBER>`.

Example:

```bash
$ yarn set-version 1.0.0-rc.1
# Output
# ...
# Will set android version code to 100001
# ...
# Will set CFBundleVersion to 1.0.0.1
$ yarn set-version 1.0.0-rc.2
# Output
# ...
# Will set android version code to 100002
# ...
# Will set CFBundleVersion to 1.0.0.2
$ yarn set-version 1.0.0
# Output
# ...
# Will set android version code to 100003
# ...
# Will set CFBundleVersion to 1.0.0.3
```

## License

This software uses the [MIT license](LICENSE.txt).

## Contributing

You must use the following style guide:

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

This project contains a linting config, you should setup `eslint` into your IDE with `.eslintrc.js`.
