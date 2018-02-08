'use strict';

const webpack           = require('webpack');
const chalk             = require('chalk');
const clearConsole      = require('react-dev-utils/clearConsole');

const createMessage     = require('./messages');

function printLogs(stats) {
  const messages = createMessage(stats);
      
  const isSuccessful = !messages.errors.length && !messages.warnings.length;
  if (isSuccessful) {
    console.log(chalk.green('\nCompiled successfully!\n'));
    messages.infos(stats);
  }
  
  if (messages.errors.length) {
    console.log('Failed to compile.');
    messages.errors.forEach(e => console.log(e));
    return;
  }
  
  const hasWarnings = !messages.errors.length && messages.warnings.length;

  if (hasWarnings) {
    console.log(chalk.red('\n\nCompiled with warnings...\n'));
    messages.warnings.forEach(e => console.log(e));
    messages.infos(stats);
  }
}
 
function printInstructions(appName, urls, useYarn) {
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(
      `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
    );
    console.log(
      `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`
    );
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(
    `To create a production build, use ` +
      `${chalk.cyan(`${useYarn ? 'yarn' : 'npm run'} build`)}.`
  );
  console.log();
}

module.exports = (webPackConfig, settings ) => {

  const isProduction = process.env.NODE_ENV === 'production';
  const isInteractive = process.stdout.isTTY;

  const compiler = webpack(webPackConfig);

  compiler.plugin('invalid', () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log('Compiling...');
  });
  
  
  if (isProduction) {
    return new Promise((resolve, reject) => {
      return compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }
        return printLogs(stats);
      });
    });
  } else {
    let isFirstCompile = true;

    // "done" event fires when Webpack has finished recompiling the bundle.
    // Whether or not you have warnings or errors, you will get this event.
    compiler.plugin('done', stats => {
      if (isInteractive) {
        clearConsole();
      }
      const messages = createMessage(stats);

      const isSuccessful = !messages.errors.length && !messages.warnings.length;
      if (isSuccessful) {
        console.log(chalk.green('Compiled successfully!\n'));
        messages.infos(stats);
      }
      if (isSuccessful && (isInteractive || isFirstCompile)) {
        printInstructions(settings.appName, settings.urls, settings.useYarn);
      }
      isFirstCompile = false;

      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        console.log(chalk.red('Failed to compile.\n'));
        console.log(messages.errors.join('\n\n'));
        return;
      }

      if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(messages.warnings.join('\n\n'));
  
        // Teach some ESLint tricks.
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
        messages.infos(stats);
      }
    });
    return compiler;
  }

};