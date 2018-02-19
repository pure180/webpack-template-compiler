/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

const Table = require('cli-table');
const chalk = require('chalk');

const formatMessages = require('webpack-format-messages');

function createLogTable(data) {
  return [
    data.name,
    Number(data.size / 1000 ) + 'kb', 
    data.chunks.join(', '),
    data.emitted.toString(), 
    data.chunkNames.join(', ')
  ];
}

function createInfos(stats) {
  console.log('Hash:\t\t', chalk.green(stats.hash));
  console.log('Version:\t', 'webpack ' + stats.version);
  console.log('Time:\t\t', stats.time, 'ms\n');
  if (stats.assets && stats.assets.length > 0 ) {
    console.log('\nASSETS');
    const assetTable = new Table({
      head: ['Asset', 'Size', 'Chunks', 'emitted', 'Chunk Names'],   
      chars: { 
        'top': '-' , 'top-mid': '-' , 'top-left': '-' , 'top-right': '-', 
        'bottom': '-' , 'bottom-mid': '-' , 'bottom-left': '-' , 'bottom-right': '-', 
        'left': ' ' , 'left-mid': ' ' , 'mid': ' ' , 'mid-mid': ' ', 
        'right': ' ' , 'right-mid': ' ' , 'middle': ' ' }
    });
    stats.assets.forEach(asset => {
      assetTable.push(createLogTable(asset));
    });
    console.log(assetTable.toString(), '\n');
  }
}

module.exports = (stats) => {
  const messages = formatMessages(stats);
  const errors = messages.errors;
  const warnings = messages.warnings;
  return {
    errors,
    warnings,
    infos: stats => createInfos(stats.toJson({}, true))
  };
};