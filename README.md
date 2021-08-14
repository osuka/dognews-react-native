# News article checker

Small react native app to check articles that have been submitted or automatically
retrieved and decide manually what to post to a news aggregator [only dog news](https://onlydognews.com).

This is an internal tool intended also as a testbed for me to try react native while actually making
something I can use.

You may find bits of code you'd like to check/copy - be my guest

## Setup

This project is a multiplatform react native mobile application. The number of dependencies and the
fragility of the ecosystem (like all other mobile multi platform systems) make it particularly tricky
to install and setup. I recommend using package managers to make sure the correct version is installed
of every dependency.

This project requires:

* Node JS (for react)
* XCode (iOS)
* Android SDK

### Dependencies

#### Node js

I recommend using [nvm](https://github.com/nvm-sh/nvm) to setup node. Just install it and then run `nvm i`
from the root of the project. Alternatively install the latest node 10.x any other way.

#### Java

I recommend [jEnv](http://www.jenv.be/) to setup java if you'll have multiple versions. If not, just make
sure to have java 1.8+ installed.

* Confirmed to work under linux with openjdk 11.

> Note that react native used to require specifically java 1.8.x, which was very annoying if you are a developer. If there's issues with java you can always try with that. On Mac OS X you can get it by installing the [brew](https://brew.sh/) package manager and running `brew cask install adoptopenjdk8`

#### Android SDK

The best way to get Android running is to install the whole [Android Studio](https://developer.android.com/studio/) app. This will install
everything you need.

Check the [notes](./NOTES.md) for some tips and tricks in case of problems.

#### XCode

To create native iOS builds you will need to have XCode installed.

#### Fonts

This project uses some of the Icons from Font Awesome, retrieved via the package [react-native-vector-icons](https://www.npmjs.com/package/react-native-vector-icons),
as this makes the repo smaller.
Once the node packages have been installed with `node i` or `node ci`, you'll need to copy them over to the assets folder:

```sh
npm run fontawesome
```

> Note that this runs a script from package.json `cp node_modules/react-native-vector-icons/Fonts/FontAwesome*.ttf android/app/src/main/assets/fonts/`

#### React native recommends having [watchman](https://facebook.github.io/watchman/) installed

The installation in Linux is as follows:

```sh
# ubuntu 20.04+
sudo apt install -y watchman

# other distros if they lack watchman
git clone https://github.com/facebook/watchman.git
cd watchman
git checkout v4.9.0  # or wahtever the latest stable release
./autogen.sh
./configure
make
sudo make install
```

This will leave it installed in `/usr/local/bin/watchman`.

## Running

### Run instructions for iOS

* `npx react-native run-ios`
or
* Open dognews_checker/ios/dognews_checker.xcodeproj in Xcode or run "xed -b ios"
* Hit the Run button

More here in the [official guide](https://facebook.github.io/react-native/docs/running-on-simulator-ios)

### Run instructions for Android

* Have an Android emulator running (quickest way to get started), or a device connected.
* `npx react-native run-android`

> * If it fails, remember to make java 1.8 the selected one, run `jenv local 1.8` before.
> * If it says `> com.android.builder.testing.api.DeviceException: No connected devices!` use Android Studio to launch a simulator, or plug one in.

### Run instructions from Visual Studio Code (Android / iOS)

The Visual Studio Code extensions for react help a lot, simply install the [React Native Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native) extension by Microsoft.
It allows to debug while running on the device and works for both Android and iOS.

### Building for release (bundling)

```sh
npm run bundle-android
npm run bundle-ios
```

> This simply runs this script from package.json: `npx react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`

Releasing the application in android needs a bit of love, haven't needed to do it yet. Check [the official guide](https://facebook.github.io/react-native/docs/signed-apk-android)
