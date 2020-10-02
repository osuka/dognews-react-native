/* eslint-disable no-undef */
// Jest environment setup for react navigation
//
// this file is loaded by jest (due to jest.config.js)
//

// https://reactnavigation.org/docs/testing/

// import 'react-native-gesture-handler/jestSetup';

// jest.mock('react-native-reanimated', () => {
//   const Reanimated = require('react-native-reanimated/mock');

//   // The mock for `call` immediately calls the callback which is incorrect
//   // So we override it with a no-op
//   Reanimated.default.call = () => {};

//   return Reanimated;
// });

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// combine this with including in the jest configuration:
// "setupFiles": [
//   ...
//   "<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js",
//   "<rootDir>/__setup__/react-navigation.ts"
// ],
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
