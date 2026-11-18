module.exports = function (api) {
  //api.cache(true);
  
  const isWeb = api.caller((caller) => caller?.target === "web");

  return {
    presets: [
      '@react-native/babel-preset',
    ],
    plugins: [
      // React Native Reanimated MUST be last
      ["@babel/plugin-transform-private-methods", { loose: true }],
      ["@babel/plugin-transform-private-property-in-object", { loose: true }],
      ["@babel/plugin-transform-class-properties", { loose: true }],
      ["@babel/plugin-proposal-export-namespace-from"],
      
      // Only apply runtime transform for web
      isWeb && ["@babel/plugin-transform-runtime", { corejs: 3 }],
      
      ["module:react-native-dotenv", {
        moduleName: "@env",
        path: ".env",
        allowUndefined: true
      }],
      
      // Reanimated plugin must be last
      'react-native-reanimated/plugin',
    ].filter(Boolean), // Remove false/null entries
  };
};