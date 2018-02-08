'use strict';

const webpack                           = require('webpack'),
      path                              = require('path'),
      paths                             = require('./paths'),
      autoprefixer                      = require('autoprefixer'),
      ExtractTextPlugin                 = require('extract-text-webpack-plugin'),
      ModuleScopePlugin                 = require('react-dev-utils/ModuleScopePlugin'),
      InterpolateHtmlPlugin             = require('react-dev-utils/InterpolateHtmlPlugin'),
      SuppressChunksPlugin              = require('suppress-chunks-webpack-plugin').default,
      {
        assignPugTemplates,
        excludeChunksArray,
        globals,
        normalizeFileName,
        resolveEntries,
        resolvePath,
        suppressChunks,
      }                                 = require('../lib/utils/index'),
      getClientEnvironment              = require('./env'),
      ManifestPlugin                    = require('webpack-manifest-plugin'),
      HtmlWebpackExcludeAssetsPlugin    = require('html-webpack-exclude-assets-plugin'),
      CopyWebpackPlugin                 = require('copy-webpack-plugin');

const publicPath                        = paths.servedPath;
const shouldUseRelativeAssetPaths       = publicPath === './';
const shouldUseSourceMap                = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl                         = publicPath.slice(0, -1);
const env                               = getClientEnvironment(publicUrl);

const extractTextPluginOptions          = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

const extractPug                        = new ExtractTextPlugin(normalizeFileName('pug', 'html'));
const extractScss                       = new ExtractTextPlugin(normalizeFileName('scss', 'css', 'css/'));
const entries                           = resolveEntries('src/app');
const excludedJsChunks                  = excludeChunksArray(entries.files)
const htmlWebpackPluginArray            = assignPugTemplates(entries.globs);

const config = {
  stats: {
  },
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  context: paths.appEntry,
  entry: entries.files,
  output: {
    path: paths.appDist,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
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
        loader: require.resolve('pug-loader')
      }, {
        test: /\.scss$/,
        exclude: globals.execludeNoneTextExtensions,
        loader: extractScss.extract(
          Object.assign({
            fallback: require.resolve('style-loader'),
            use: [{
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: false,
                sourceMap: shouldUseSourceMap,
              },
            }, {
              loader: require.resolve('postcss-loader'),
              options: {
                minimize: true,
                sourceMap: shouldUseSourceMap,
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
            }, {
              loader: require.resolve('sass-loader'),
              options: {
                includePaths: [paths.appNodeModules, paths.appSass],
                minimize: true,
                sourceMap: shouldUseSourceMap,
              },
            }],
          }, extractTextPluginOptions)
        ),
      }, {
        loader: require.resolve('file-loader'),
        exclude: [/\.js$/, /\.html$/, /\.json$/, /\.pug$/, /\.scss$/, /\.less$/, /\.jade$/],
        options: {
          name: 'media/[name].[ext]',
        },
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      }]
    }],
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new webpack.DefinePlugin(env.stringified),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }),
    new SuppressChunksPlugin(suppressChunks(Object.keys(entries.files))),
    extractPug,
    extractScss,
    ...htmlWebpackPluginArray,
    new HtmlWebpackExcludeAssetsPlugin(),
    new CopyWebpackPlugin([{
      from: paths.appPublic,
      to: paths.appDist,
    }]),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      filter: (file) => {
        const expression = /(^(pug|jade)|\.html|^(scss|less).*\.js)/;
        if (expression.test(file.name)) { return; }
        return file;
      },
      map: (file) => {
        const expression = /^(scss|less)/;
        if (!expression.test(file.name)) { return file;}
        const fileName = file.name;
        file.name = fileName.replace(expression, '').toLowerCase();
        return file;
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
}

module.exports = config;