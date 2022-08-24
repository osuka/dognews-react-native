# Developer mini blog

> A collection of notes for me and my future self
---

## 2022-08-23 Upgrade all dependencies

Since there's been quite a few changes, we start with a fresh project and copy from it:

```bash
npx react-native init onlydognewsapp --title "Only Dog News" --template react-native-template-typescript

# the app there will be named com.onlydognewsapp but we want a subdomain
npx react-native-rename -b com.onlydognews.checker

# copy files
rm -rf ios
mv ../onlydognewsapp/ios .
rm -rf ios
mv ../onlydognewsapp/android .
# adjust package
mkdir -p android/app/src/main/java/com/onlydognews/checker/
mv android/app/src/debug/java/com/onlydognewsapp/ReactNativeFlipper.java android/app/src/main/java/com/onlydognews/checker/

# copy dependencies - this is a very manual and painful process of checking what is used now vs what we had
# vim package.json

# copy:
cd ../onlydognews
cp .eslintrc babel.config.js metro.config.js

# tweaks
# add in babel.config.js:
    # // for selderee (from html-to-text)
    # "@babel/plugin-transform-modules-commonjs"
# and in metro.config.js:
#  // for selderee (html-to-text) we need cjs
#   resolver: {
#     sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs'],
#   },


# update nvmrc, we move to nodejs 18 which is the current release
nvm i
npm i

# update with android studio the android version
# upgrade to 31, latest platform tools etc
# copy app/build.gradle and build.gradle
# add to app/build.gradle
  # add the following property to the defaultConfig in `android/app/build.gradle`:

```bash
android {
  defaultConfig {
    manifestPlaceholders = [
      appAuthRedirectScheme: 'com.onlydognews.checker'
    ]
  }
}
```

Check the tests

```bash
npx jest
```


## 2021-08-13 Migrate openapi client generator

https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/typescript-axios.md

Will be moving to using the same one we are using for python, https://github.com/OpenAPITools/openapi-generator

```sh
npx @openapitools/openapi-generator-cli generate -i ../dognews-server/openapi-schema.yml -g typescript-axios -o lib/generated/api_client --additional-properties=disallowAdditionalPropertiesIfNotPresent=false,paramNaming=camelCase,modelPropertyNaming=original,enumPropertyNaming=original
```
Reference guide: https://majidlotfinia.medium.com/openapi-generator-for-react-native-by-swagger-58847cadd9e8

> There are several additional properties that can added simply separated by commas in the value like `--additional-properties=disallowAdditionalPropertiesIfNotPresent=false`

For this to work we need:

```sh
npm i --save react-native-url-polyfill
```

And loading it as `import 'react-native-url-polyfill/auto';`

Otherwise we will get:

```text
Error: not implemented
 at URL.get (URL.js:195)
 at setSearchParams (common.ts:91)
 at getPetById$ (api.ts:450)
 at tryCatch (runtime.js:63)
 at Generator.invoke [as _invoke] (runtime.js:293)
 at Generator.next (runtime.js:118)
 at tryCatch (runtime.js:63)
 at invoke (runtime.js:154)
 at runtime.js:164
 at tryCallOne (core.js:37)
```

## 2021-07-21 Update everything

Update everything to the latest version. Many things break.

```sh
npm i --save-dev @babel/preset-typescript
vim babel.config.js, add @babel/preset-typescript to list of packages
npm i --save-dev @types/jest
npm i --save-dev ts-node
```

Need to update react-navigation.ts configuration following [the official instructions](https://reactnavigation.org/docs/testing/)

ERROR:

Running on android fails with a mystical "Could not initialize class org.codehaus.groovy.runtime.InvokerHelper" this seems to be because I have reinstalled android studio/java/gradle etc and am starting from zero.

* Create a new app from scratch to check what's changed
* mkdir p && cd p && npx react-native init AwesomeProject (with react loaded)
* Differences since last react-native-version:
  * metro.config.js now has inlineRequires set to true (copy change)
  * build.gradle, gradle.properties changed versions (build tools 29.0.2->29.0.3, minsdk 16->21) (copy change)
  * gradlew.bat changed (copy change)
  * settings.gradle, gradlew unchanged
  * gradle-wrapper.properties moves from 6.2 to 6.7 (copy change)
  * app/build.gradle sameish
  * app/src/main/AndroidManifest.xml -> there is no `<activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />` i don't remember

Now getting:

```text
>  General error during semantic analysis: Unsupported class file major version 61
Could not compile settings file '/home/osuka/Documents/non-shared-code/dognews-checker-react/android/settings.gradle'.
> startup failed:
  General error during semantic analysis: Unsupported class file major version 61
```

Add the JDK that is included with Android Studio and use that one:

```bash
jenv add /opt/android-studio/jre
```

It now complains of the SDK license. Suggests `$ANDROID_HOME/tools/bin/sdkmanager --licenses` but this doesn't work with openjdk (`Exception in thread "main" java.lang.NoClassDefFoundError: javax/xml/bind/annotation/XmlSchema`)
Approve the licenses by going to Android Studio / SDK Manager and installing

- Android SDK Command-line Tools (latest) version 4.0

> Note: the runner is smart enough to install "Install Android SDK Platform 29 (revision: 5)" even though I had a different version installed in Android Studio.

The latest version of [html-to-text](https://github.com/html-to-text/node-html-to-text) is 8.0.0 but it breaks, keeping it at 5.x.x.

Issue:
> Require cycle with fetch.js while debugging

## 2020-10-09 A note on dependencies

It's funny how things get complicated over time and package.json without comments doesn't help that much. So far:

* moment: just because the date API is still a pain

* react-native:
  react
  react-native

* font awesome support:
  react-native-vector-icons

* web view support:
  react-native-webview

* react navigation:
  @react-navigation/core, @react-navigation/drawer, @react-navigation/native, @react-navigation/stack, which need:
  react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view

* html-to-text includes htmlparser2 which in node needs:
  events buffer

* for offline storage:
  @react-native-community/async-storage

* oauth:
  react-native-app-auth

* temporarily (to be moved to ActivityIndicator):
  react-native-loading-spinner-overlay

For dev we have all the available type definitions, plugins for eslint, babel, jest:

* typescript
* types: @types/jest, @types/react, @types/react-native, @types/react-native-vector-icons
* for syntax: prettier
* for linting: @react-native-community/eslint-config, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint
* for testing: @testing-library/jest-native, @testing-library/react-native, @types/react-test-renderer, react-test-renderer, babel-jest, jest
  * identity-obj-proxy: we use this so that when we are importing an image via `import`, jest doesn't get confused during parsing - it replaces it with an empty javascript
* for building: metro-react-native-babel-preset
* per app: mock-async-storage

Interestengly there is still a require cycle with using `fetch()`. Known and ignored https://github.com/facebook/react-native/issues/23130, https://github.com/facebook/metro/issues/287.

The recommended workaround in the comments there is to disable cycles in node_modules, I'm making it more detailed to ignore just the one I'm getting:

```js
import { LogBox } from 'react-native'

LogBox.ignoreLogs([
  'Require cycle: node_modules/react-native/Libraries/Network/fetch.js'
])
```

---

## 2020-10-07 FlatList vs collection of Views

While doing the refactoring and setting up the layout I used just a set of Views one under the other. It's a quick way to see how they look without getting side effects. Once it is more or less set we need to move to a more optimized structure as it will choke after enough elements.

Draft version:

* A ScrollView containing Views

Final version:

* A flatlist (flatlist should never go inside scroll views). Some notes:
* renderItem simply returns a View object
* keyExtractor assigns a key attribute to each node (mandatory if we don't add the key directly).
* windowSize how many viewports to cache, can be tweaked to prevent blank spaces while scrolling

```jsx
    <View style={styles.screenMain}>
      <FlatList<Article>
        data={articles}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.target_url || index.toString()}
        windowSize={20}
      />
    </View>
```

More details [in the docs](https://reactnative.dev/docs/flatlist).

---

## 2020-10-04 Generate a client from an openapi specification

Our django backend utilizes an app that exports a swagger view and swagger provides a converter to openapi.

```sh
curl -o openapi.spec "https://dognewsserver.gatillos.com/api/schema/?format=json"
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

> COMMAND+M  (or CTRL+M)  a couple of times means shake

and then from there select 'Debug JS Remotely'
