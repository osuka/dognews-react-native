// <rootDir>/jest.config.js
/* global module */

module.exports = {
  verbose: true,
  preset: 'react-native',
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: [
    '<rootDir>/__setup__/general.ts',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js'
  ],

  // during jest runs, react-navigation tries to load a png with importand jest intercepts it
  // https://github.com/facebook/jest/issues/2663
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },

  // By default jest doesn't transform ES6 js code from node_modules, we need to tell it to
  // do it for some (ie 'ignore all but these')
  transformIgnorePatterns: [
    "node_modules/(?!react-native|react-navigation|@okta)/"
  ],

  unmockedModulePathPatterns: [
    "react",
    "react-native"
  ],

  automock: true
};
