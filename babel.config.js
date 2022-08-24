
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
  plugins: ['react-native-reanimated/plugin',
    // for selderee (from html-to-text)
    "@babel/plugin-transform-modules-commonjs"
  ]
};
