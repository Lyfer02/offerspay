const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (_env, argv = {}) => {
  const NODE_ENV = argv.mode || process.env.NODE_ENV || 'development';
  const isProduction = NODE_ENV === 'production';

  return {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: [path.join(__dirname, 'index.web.js')],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
    assetModuleFilename: 'assets/[name].[hash][ext]',
  },
  resolve: {
    
    mainFields: ['browser', 'main', 'module'],
    alias: {
      // 'react-native-share':false,
      'react-native-fs': false,
      'react-native$': 'react-native-web',
      process: require.resolve("process/browser"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      'react-native-vector-icons': 'react-native-vector-icons/dist',
      'react-native-linear-gradient': path.resolve(__dirname, 'src/web-components/LinearGradient.web.js'),
      '@react-native-vector-icons/get-image': path.resolve(__dirname, './mockComponent.js'),
      '@expo/vector-icons/MaterialCommunityIcons': require.resolve(
        'react-native-vector-icons/MaterialCommunityIcons'
      ),
      'react-native-ratings': path.resolve(__dirname, './mockComponent.js'),
      'react-native-date-picker': path.resolve(__dirname, './mockComponent.js'),
      'react-native-dynamic-search-bar': path.resolve(__dirname, './mockComponent.js'),
      'react-native-super-grid': path.resolve(__dirname, './mockComponent.js'),
      '@dotlottie/react-player': path.resolve(__dirname, './mockComponent.js'),
      '@react-native-community/datetimepicker': path.resolve(__dirname, './mockComponent.js'),
      'react-native-paper/lib/commonjs/components/MaterialCommunityIcon.js':
    path.resolve(__dirname, 'src/utils/DummyIcons.js'),

  // 'react-native-paper/lib/module/components/MaterialCommunityIcon.js':
  //   path.resolve(__dirname, 'src/utils/DummyIcons.js'),
   },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
      net: false,
      tls: false,
      os: require.resolve("os-browserify"),
      zlib: false,
      http: false,
      https: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      'process/browser': require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
       // exclude: /node_modules\/(?!(react-native|@react-native|react-native-vector-icons|@expo|react-native-paper)\/).*/,
        // exclude: [/node_modules/, /node_modules\/(?!(@react-native-community\/datetimepicker))/],
        exclude: /node_modules\/(?!(react-native|react-native-image-picker|@react-native|react-native-vector-icons|@expo|expo-modules-core|expo|react-native-paper)\/).*/,
 
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', 'not dead', '> 0.2%']
                },
                modules: 'auto',
                useBuiltIns: 'usage',
                corejs: 3
              }],
              '@babel/preset-react',
              '@babel/preset-typescript',
              '@babel/preset-flow'
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }],
              ['@babel/plugin-transform-modules-commonjs', { allowTopLevelThis: true }],
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              '@babel/plugin-proposal-export-namespace-from',
              ['module:react-native-dotenv', {
                moduleName: '@env',
                path: '.env',
                blocklist: null,
                allowlist: null,
                safe: false,
                allowUndefined: true
              }],
              require('react-native-reanimated/plugin')
            ],
          },
        },
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.ts$/,
        include: /node_modules\/expo-modules-core/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-typescript'] }
        }
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      filename: 'index.html',
      inject: true,
      ...(isProduction && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }
      })
    }),
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(!isProduction),
      'process.env.SC_DISABLE_SPEEDY': JSON.stringify(!isProduction),
      'process.platform': JSON.stringify('web'),
    }),
    new NodePolyfillPlugin(),
    ...(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
    ...(isProduction ? [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      })
    ] : []),
    ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : []),
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
      }),
    ],
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8080,
    open: true,
    historyApiFallback: true,
    compress: true,
    client: {
      progress: true,
    },
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  };
};