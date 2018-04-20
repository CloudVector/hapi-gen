"use strict";

const pkg = require('../package.json');
const folders = require('./folders.js')
const PLUGINS_FOLDER = 'plugins';
// Load plugins
let plugins = [];

// Add plugins required for hapi to work properly with swagger and static folders
plugins.push(require('inert'));
plugins.push(require('vision'));

/* Add logging plugin */
plugins.push({
    plugin: require('hapi-pino'),
    options: {
        prettyPrint: (process.env.NODE_ENV !== 'production'),
        logEvents: ['request-error']
    }
});

/*
  Interactive tool for REST Api testing
  https://github.com/glennjones/hapi-swagger
  https://github.com/swagger-api/swagger-ui
*/
plugins.push({
    plugin: require('hapi-swagger'),
    options: {
        documentationPath: '/docs',
        info: {
          title: 'Api endpoints',
          version: pkg.version
        }
    }
});

// Load plugins
let list = await folders([__dirname, '..', PLUGINS_FOLDER].join('/'));
/* Register ALL widgets */
//console.log('Loading plugins...');
list.forEach((folder) => {
    let file = ['../', PLUGINS_FOLDER, '/', folder, '/', 'index.js'].join('');
    try {
        var plugin = require(file);
        plugins.push(plugin);
        console.log('  Loaded: ' + folder.toUpperCase() + '  plugin...');
    } catch (e) {
        console.error(e);
    }
});

module.exports = plugins;