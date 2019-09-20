# Notes

## Setup and first time installation

There's a number of things that can go wrong setting up the environment for react native project. You will find a lot of information online, I've just added here some of the issues I've found building this project on Mac OS X and Linux.

### Initial creation of the app

```sh
npx react-native init dognews_checker
```

### Weird gradle errors

For some Oracle-y reason, gradle will throw bizarre errors if not using the Java SDK 1.8.

```sh
jenv local 1.8
```

On a mac: `brew cask install adoptopenjdk8`

### Missing keystore for android builds

Android needs to have a debug keystore. You can create one as follows:

```sh
keytool -genkey -v -keystore ./android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

^ the password above is 'android', we don't care too much about it as it's just the debug keystore

### Missing emulator engine

If facing the following error:

> PANIC: Missing emulator engine program for 'x86' CPU.

Solve by adding something like this to your .bashrc/profile:

```sh
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools/bin:$PATH"
```

The order there is important, emulator before tools.

### eslint in Visual Studio Code complains

> ESLint: ESLint configuration in .eslintrc.js » @react-native-community/eslint-config is invalid: 	- Property "overrides" is the wrong type (expected array but got `{"files":["**/__tests__/**/*.js","**/*.spec.js","**/*.test.js"],"env":{"jest":true,"jest/globals":true}}`).  Referenced from: .../dognews_checker_react/.eslintrc.js. Please see the 'ESLint' output channel for details.

Solved by

```sh
npm install --save-dev babel-eslint eslint eslint-plugin-react
```

```
vim .eslintrc
{
    "parser": "babel-eslint",
    "env": {
        "browser": true
    },
    "plugins": [
        "react"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        // overrides
    }
}
```

Also remove the auto generated .eslintrc.js (that had `module.exports = { root: true, extends: '@react-native-community', };`)

### Debugging on the emulator

The protocol listens on http://localhost:8081/debugger-ui

On VS Code, Add Configuration, React Native Android, generates:

```
    {
      "name": "React Native Android",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    },
```

This launches the app and starts listening, but breakpoints don't work yet.

To launch the debug menu in the emulator we press

> COMMAND+M   a couple of times means shake

and then from there select 'Debug JS Remotely'

## React notes

### Native Library links (react-native link)

React native libraries that contain native code need that made known to react the final native project.

Although in theory this is [all done automagically via Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md)
I've run into problems with this and the only solution seems to manually link. The following sections
detail how.

### Navigation

As per [the official guide](https://facebook.github.io/react-native/docs/navigation):

```sh
npm install --save react-navigation
+ react-navigation@3.11.1
added 19 packages from 8 contributors and audited 948879 packages in 5.991s

npm install --save react-native-gesture-handler
+ react-native-gesture-handler@1.3.0
added 2 packages from 2 contributors and audited 948889 packages in 4.188s

npx react-native link react-native-gesture-handler
```

### WebViews

```sh
npm install --save react-native-webview
npx react-native link react-native-webview
```

Otherwise it throws
```
[Info] 08-15 20:09:06.938  5651  6208 E ReactNativeJS: Invariant Violation: Invariant Violation: requireNativeComponent: "RNCWebView" was not found in the UIManager.
08-15 20:09:06.938  5651  6208 E ReactNativeJS:
08-15 20:09:06.938  5651  6208 E ReactNativeJS: This error is located at:
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in RNCWebView (at WebView.android.js:208)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in RCTView (at View.js:35)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in View (at WebView.android.js:211)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in WebView (at ArticleWebView.tsx:10)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in RCTView (at View.js:35)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in View (at ArticleWebView.tsx:9)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in ArticleWebView (at SceneView.js:9)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in SceneView (at StackViewLayout.tsx:888)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in RCTView (at View.js:35)
08-15 20:09:06.938  5651  6208 E ReactNativeJS:     in View (at StackViewLayout.tsx:887)
...
```

## Prettify with prettier

I've added [prettier](https://prettier.io/) to the project and gave it control of what the code needs to look like.

```sh
npx i --save-dev prettier
```

To reformat the code, simply run:

```sh
npx run pretty
```

> Note that this will simply run the script defined in package.json, which is something like `npx prettier --write '{app,lib,__tests__,__mocks__}/**/*.{js,jsx,ts,tsx}'`

Prettier can be tweaked in the [prettier.config.js](./prettier.config.js) file.
