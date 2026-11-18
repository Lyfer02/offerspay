module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|ttf|woff2?)$': '<rootDir>/jest.assetMock.js',
    '^react-native-vector-icons/.*$': '<rootDir>/jest.iconMock.js',
  },
};
