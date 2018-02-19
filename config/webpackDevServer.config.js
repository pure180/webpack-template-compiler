/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const config = require('./webpack.config.dev');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

const glob = require('glob');
const contentBaseGlob = glob.sync(paths.appPublic + '/**/*');
const filterContentBase = (filter, reg) => {
  const arr = [];
  const regEx = reg ? reg : /\.[A-Za-z]*$/;
  filter.forEach(n => {
    if (!regEx.test(n)) {
      arr.push(n);
    }
  });
  return arr;
}

const contentBase = filterContentBase(contentBaseGlob)

module.exports = function(proxy, allowedHost) {
  return {
    disableHostCheck:
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true,
    clientLogLevel: 'none',
    contentBase: contentBase,
    watchContentBase: true,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    },
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    public: allowedHost,
    proxy,
    before(app) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    },
    
  };
};
