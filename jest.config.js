// <rootDir>/jest.config.js
module.exports = {
  verbose: true,
  preset: 'react-native',
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: [
    '<rootDir>/__setup__/general.ts',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],

  // during jest runs, react-navigation tries to load a png with importand jest intercepts it
  // https://github.com/facebook/jest/issues/2663
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },

  "transformIgnorePatterns": [
    // if this is not provided, it will throw error on finding 'Import' as this module is not
    // precompiled to node-compatible js
    "node_modules/react-navigation/"
  ]
}
