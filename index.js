'use strict';

const buildProduction   = require('./scripts/build');
const startServer       = require('./scripts/start.js');

const argv              = process.argv;
const production        = argv.indexOf('--prod') > -1;
const start             = argv.indexOf('--serve') > -1;

if (production) {
  buildProduction();
}

if (start) {
  startServer();
}
