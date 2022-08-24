/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // for selderee (html-to-text) we need cjs
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs'],
  },
};
