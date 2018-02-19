/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

const webpack = require('webpack'),
      path = require('path'),
      paths = require('./paths'),
      autoprefixer = require('autoprefixer'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin'),
      SuppressChunksPlugin = require('suppress-chunks-webpack-plugin').default,
      {
        assignPugTemplates,
        excludeChunksArray,
        globals,
        normalizeFileName,
        resolveEntries,
        resolvePath,
        suppressChunks,
      } = require('../lib/utils/index'),
      getClientEnvironment = require('./env'),
      ManifestPlugin = require('webpack-manifest-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin'),
      CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'),
      WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin'),
      CopyWebpackPlugin = require('copy-webpack-plugin'),
      WriteFilePlugin = require('write-file-webpack-plugin'),
      InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

// const extractTextPluginOptions = shouldUseRelativeAssetPaths ? { publicPath: Array(cssFilename.split('/').length).join('../') }: {};

const extractPug = new ExtractTextPlugin(normalizeFileName('pug', 'html'));
const extractScss = new ExtractTextPlugin(normalizeFileName('scss', 'css', 'css/'));

const entries = resolveEntries('src/app');

const excludedJsChunks = excludeChunksArray(entries.files);
const htmlWebpackPluginArray = assignPugTemplates(entries.globs, {pretty: true});

const devEntries = [];
Object.keys(entries.files).forEach(key => devEntries.push(entries.files[key][0]));

const copyWebpackPluginIncludeExp = /\.(bmp|gif|jpe?g|png)$/;

const config = {
  bail: true,
  devtool: 'cheap-module-source-map',
  entry: [
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    ...devEntries,
  ],
  output: {
    path: paths.appDist,
    pathinfo: true,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    publicPath: publicPath,
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    extensions: [
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
      '.es6',
      '.js',
    ],
    alias: {},
    plugins: [
      new ModuleScopePlugin(paths.appEntry, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: require.resolve('tslint-loader'),
      enforce: 'pre',
      include: paths.appEntry,
    },
    {
      test: /\.js$/,
      loader: require.resolve('source-map-loader'),
      enforce: 'pre',
      include: paths.appEntry,
    }, {
      oneOf: [{
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'media/[path]/[name].[hash:8].[ext]',
        },
      }, {
        test: /\.js/,
        exclude: globals.execludeTextExtensionsEndsWith,
        use: [{
          loader: require.resolve('eslint-loader'),
          options: {},          
        }, {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['babel-preset-env'],
            comments: false,
            minified: true,
            sourceMaps: shouldUseSourceMap,
          }
        }]
      }, {
        test: /\.(ts|tsx)$/,
        include: paths.appEntry,
        loader: require.resolve('ts-loader')
      }, {
        test: /\.pug$/,
        exclude: globals.execludeNoneTextExtensions,
        loader: require.resolve('pug-loader'),
        options: {
          pretty: false,
        }
      }, {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      }, {
        test:/\.scss$/,
        use: [
          require.resolve('style-loader'),
        {
           loader: require.resolve('css-loader'),
           options: {
            importLoaders: 1,
            sourceMap: true,
          },
        }, {
          loader: require.resolve('postcss-loader'),
          options: {
            ident: 'postcss',
            sourceMap: true,
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        }, {
          loader: require.resolve('sass-loader'),
          options: {
            includePaths: [paths.appNodeModules],
            sourceMap: true,
          }
        }]
      }, {
        loader: require.resolve('file-loader'),
        exclude: [/\.js$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/[name].[hash:8].[ext]',
        },
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      }]
    }],
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    ...htmlWebpackPluginArray,
    new CopyWebpackPlugin([{
      from: paths.appPublic,
      to: paths.appDist,
    }]),
    new WriteFilePlugin({
        // Write only files that have ".css" extension.
        test: copyWebpackPluginIncludeExp,
        useHashIndex: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },
};

module.exports = config;