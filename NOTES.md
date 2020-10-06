# Developer mini blog

> A collection of notes for me and my future self

---

## 2020-10-04 Generate a client from an openapi specification

Our django backend utilizes an app that exports a swagger view and swagger provides a converter to openapi.

```sh
curl -o openapi.spec https://dognewsserver.gatillos.com/swagger/?format=openapi
npx openapi-typescript-codegen \
  -i openapi.spec \
  -o lib/generated/dognewsserverclient \
  -c fetch \
  --useUnionTypes
```

This is based on [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen). This project will generate a whole structure of services and models supporting my API, with type definitions for all requests and reponses which I find very handy. The generated code is pretty cleand and straightforward, so could be used just as a starting point if one doesn't want to use the tool again to recreate it after updates, of it the project stops being maintained etc.

---

## 2020-10-01 Project recreation

The previous version was based on a standard react native templated manually migrated to typescript. We want to use the new react typescript template when moving to react-native 0.63.

> use [react-native-template-typescript](https://github.com/react-native-community/react-native-template-typescript)
> which is the "official" [one](https://reactnative.dev/docs/typescript)

```sh
cd "<to a parent folder inside which project will created>"
nvm use 12
npx react-native init onlydognewsapp --title "Only Dog News" --template react-native-template-typescript
```

> Note: this names the app 'com.onlydognewsapp'. We can use [react-native-rename](https://www.npmjs.com/package/react-native-rename) to adjust it, so we do: `npx react-native-rename -b com.onlydognews.checker` to change it
> had to also git mv src/debug/java/com/onlydognewsapp/ReactNativeFlipper.java src/main/java/com/onlydognews/checker/
> and edit its package

notes from the output:
> npx react-native run-ios or open dognewsapp/ios/dognewsapp.xcodeproj in Xcode or run "xed -b ios"
> npx react-native run-android
> macosx/win: check [official docs](https://aka.ms/ReactNative)

```sh
cd dognewsapp
echo "12" >.nvmrc
echo "1.8" >.java-version
```

```sh
mkdir .vscode
cat >.vscode/settings.json <<EOL
{
    "search.exclude": {
        "**/.git": true,
        "**/node_modules": true,
        "**/bower_components": true,
        "**/tmp": true,
        "Podfile.lock": true,
        "package-lock.json": true,
        "project.pbxproj": true
    }
}
EOL
```

I like to launch code with the environment set up by nvm:

```sh
cd dognewsapp
nvm use
jenv local
code $(pwd)
```

Install extensions for visual studio code:

* React Native Tools (Microsoft)

This allows to run ctrl-shift-p then "React Native: Run Android on Emulator" and other fancy stuff. It adds a "React Native Packager" at the bottom bar that does the compilation and refresh for the app so you can hit "r" "r" while the emulator is focused to reload it etc.

> double tap r to reload the app
> cmd or ctrl M or "Shake" to open the react native debug menu

The react native debug menu includes inspector, profiler.

> Note: I ended up having to run metro from the CLI to get proper hot reloading working. Just running `npm run start` in a terminal window from code does the trick. This way it updates after every save.

---

## 2019-12-18 Migrating to use a generic oauth2 integration

After adding the okta code, there are numerous links to Okta which could make moving to another oauth provider hard.
For a solution that uses okta as an oauth2 provider we'll follow [Formidable Lab's guide on the react-native-app-auth repo](https://github.com/FormidableLabs/react-native-app-auth)
First we undo all that was done in the previous section: removal of all @okta packages etc.

* Install the auth library

```bash
npm i --save react-native-app-auth
react-native link
```

* Register the native part of the library for iOS

Add this to `Podfile`

```txt
pod 'AppAuth', '>= 0.94'
```

* Register the redirect URL scheme

This is needed since iOS 10. We need to add a mapping for the schema of our app to Info.plist in iOS:

```xml
<key>CFBundleURLTypes</key>
<array>
<dict>
  <key>CFBundleURLName</key>
  <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
  <key>CFBundleURLSchemes</key>
  <array>
    <string>com.onlydognews.dognewsreviewapp</string>
  </array>
</dict>
</array>
```

* Define openURL callback in AppDelegate

Register the OpenID authorization flow in `AppDelegate.h` (added the RNAppAuthAuthorizationFlowManager paramater to the AppDelegate @protocol entry and the authorizationFlowManagerDelegate @property):

```objectivec
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "RNAppAuthAuthorizationFlowManager.h"
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, RNAppAuthAuthorizationFlowManager>
@property (nonatomic, strong) UIWindow *window;
// oauth2
@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;
@end
```

The callback comes via openURL app delegate, so we register our delegate that will listen for it:

```objectivec
...
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *, id> *)options {
 return [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url];
}

@end
```




---

## 2019-12-18 Migrating Authentication / Authorization to Okta

The best resource for this is [Matt Raible's React Native Login entry at okta](https://developer.okta.com/blog/2019/11/14/react-native-login)

After trying the default django authentication I'm moving to using [okta](https://www.okta.com/) for identity. You can register as a developer with a maximum of 1000 unique users per month which seems more than enough for this little app.

npm install --save-dev @angular-devkit/schematics-cli  # code generator from the Angular project
npm i --save-dev @oktadev/schematics
npx schematics @oktadev/schematics:add-auth

> Asks: What is your OIDC app's issuer URL? This is found in  API > Authorization Server, I pick the default one [https://dev-142820.okta.com/oauth2/default](https://dev-142820.okta.com/oauth2/default)
> Asks: What is your OIDC app's client ID? This is found in Applications

After this it starts generating pages:

CREATE /Auth.js (4345 bytes)
  A component that emits: 'signInSuccess', 'signOutSuccess', 'onError', 'onCancelled'
  A checkAuthentication method that changes state depending on auth state
  Functions: login(), logout(), getUserIdToken(), getMyUser()
  Renders a login button or, if authenticated, a logout button with two buttons to get User from Id and get User

CREATE /auth.config.js (342 bytes)
  The data entered as part of the setup, via schematics. This is all public data as it's embedded in the app (client id, redirect url, ...)

CREATE /setupJest.js (812 bytes)
  Mocks okta SDK. I move this into `__setup__` as okta.js

CREATE /tests/App-test.js (357 bytes)
  A simple 'renders' test. It differs from the typical one in mocking an extra class:
> jest.mock('../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter');
  I delete this file

CREATE /tests/Auth-test.js (5233 bytes)
  Set of tests for the login components in authenticated and unautenthicated state
  Moved to `__tests__`

UPDATE /package.json (2041 bytes)
  Added "@okta/okta-react-native" to deps and
  added @angular-devkit/schematics-cli, @oktadev/schematics, enzyme, enzyme-adapter-react-16, enzyme-async-helpers, react_dom,
  and a whole jest section with:

```json
  "jest": {
        "preset": "react-native",
        "automock": false,
        "transformIgnorePatterns": [
            "node_modules/(?!@okta|react-native)"
        ],
        "testMatch": [
            "**/tests/*.js?(x)",
            "**/?(*.)(spec|test).js?(x)"
        ],
        "setupFiles": [
            "./setupJest.js"
        ]
    }
```

  I remove the jest section and copy into jest.config.js.

UPDATE /ios/Podfile (2311 bytes)
  Increases ios platform to 11

UPDATE /android/build.gradle (993 bytes)
  Increses min sdk to 19

UPDATE /android/app/build.gradle (8345 bytes)
  Adds a line to declare the redirect on defaultConfig

Need to ajust this, as by default it had a dev-xxxx url:

```diff
+        manifestPlaceholders = [ appAuthRedirectScheme: "com.onlydognews.dognewsreviewapp" ]
```

> Error if not changed is: E SyncWebAuthClientImpl: No uri registered to handle redirect or multiple applications registered

UPDATE /App.js (3152 bytes)
  It wipes our App.js and replaces it with a demo login page. I roll back.
  The only thing it does is `import ./Auth` and add `<Auth />` in the page.

> ^ the above is in commit e5ae41d41a45913abf755196830b73dd5ed10313


---

## 2019-12-18 React notes

### Native Library links (react-native link)

React native libraries that contain native code need that made known to react the final native project.

Although in theory this is [all done automagically via Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md)
I've run into problems with this and the only solution seems to manually link. The following sections
detail how.

> update: this is no longer needed in react-native 0.63+

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

Otherwise it throws:

```text
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

---

## 2019-09-20 Setup and first time installation

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

> ESLint: ESLint configuration in .eslintrc.js » @react-native-community/eslint-config is invalid: - Property "overrides" is the wrong type (expected array but got `{"files":["**/__tests__/**/*.js","**/*.spec.js","**/*.test.js"],"env":{"jest":true,"jest/globals":true}}`).  Referenced from: .../dognews_checker_react/.eslintrc.js. Please see the 'ESLint' output channel for details.

Solved by

```sh
npm install --save-dev babel-eslint eslint eslint-plugin-react
```

`vim .eslintrc`:

```json
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

The protocol listens on [http://localhost:8081/debugger-ui](http://localhost:8081/debugger-ui)

On VS Code, Add Configuration, React Native Android, generates:

```json
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

