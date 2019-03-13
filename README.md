# React Native Set Version

React Native Set Version is a tool that let you set your version easily trough your react-native application. It will modify the following files if found:

- **./package.json**
- **./android/app/src/main/AndroidManifest.xml**
- **./android/app/build.gradle**

## Installation and Usage

There are two ways to install React Native Set Version: globally and locally.

### Local Installation and Usage

This is the recommended way to install React Native Set Version.

npm:

```bash
$ npm install react-native-set-version --save-dev
```

yarn:

```bash
$ yarn add react-native-set-version --dev
```

After that, you can run React Native Set Version in your projet directory like this:

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

### Global Installation and Usage

Use React Native Set Version in any project.

npm:

```bash
$ npm install -g react-native-set-version
```

yarn:

```bash
$ yarn global add react-native-set-version
```

After that, you can run React Native Set Version in your project directory like this:

```bash
$ setVersion <version>
-- or --
$ set-version <version>
```

**Note**: The version number must follow [semver](https://semver.org/)

## Contributing

**Never** commit directly on master, instead use branches, forks and pull requests.

Once approved, a Pull request is merged in `master` by its author. Also, it must be squashed before merging,
either manually or using GitHub's `Squash and merge` feature.

You must use the following Style Guides :

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

This project contains a linting config, you should setup `eslint` into your IDE with `.eslintrc.js`.
