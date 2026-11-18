// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  // -----------------------------------------------------------------
  // 1. Resolver – keep your block-list, just make sure SVG is handled
  // -----------------------------------------------------------------
  resolver: {
    // Keep the extensions you already use
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],

    // Remove 'svg' from assets (it’s now a source file)
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),

    // Your custom block-list (unchanged)
    blockList: [
      /.*\/index\.web\.js$/,           // Block web entry
      /.*\/webpack\.config\.js$/,      // Block webpack
      /node_modules\/react-datepicker\//,
      /.*\/node_modules\/react-dom\/.*/,
      /.*\/node_modules\/buffer\/.*/,
      /.*\/node_modules\/process\/.*/,
    ],
  },

  // -----------------------------------------------------------------
  // 2. Transformer – SVG transformer + allow require.context
  // -----------------------------------------------------------------
  transformer: {
    unstable_allowRequireContext: true,
    // THIS LINE IS THE KEY
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },

  // -----------------------------------------------------------------
  // 3. Watch folders – keep your node_modules watch
  // -----------------------------------------------------------------
  watchFolders: [path.resolve(__dirname, 'node_modules')],
};

module.exports = mergeConfig(defaultConfig, config);