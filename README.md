# jampacked

react native mobile app for [jamserve](https://github.com/ffalt/jamserve)

![test](https://github.com/ffalt/jampacked/workflows/test/badge.svg)

## Requirements

*   setup [React Native](https://reactnative.dev/docs/environment-setup) 

*   install [yarn](https://yarnpkg.com/cli/install)

## Development server Android

Run `yarn run android` for a dev server. Connected phone or else an emulator is started.

## Development server Release Build Android

Run `yarn run android:release` for a dev server. Connected phone or else an emulator is started.

## Development server IOS (Experimental)

Run `yarn run ios` for a dev server. Connected phone or else an emulator is started.

## Build Production Android

Note: You must provide your own `android/app/jam_keystore.jks`

Run `yarn run android:build:release:apk` to build the app as multiple apk per platform. 

Run `yarn run android:build:release:aab` to build the app as on multi platform aab.

Run `yarn run clean` to clean out the gradle cache & reinstall node modules.

## Running tests

Run `yarn run test` to execute the tests via [Jest](https://jestjs.io/).

