"use strict";

const pkg = require('../package.json');
const widgets = require('./widgets.js');
// Load plugins
const loadPlugins = (mode) => {
    let plugins = [];

    // Add plugins required for hapi to work properly with swagger and static folders
    plugins.push(require('inert'));
    plugins.push(require('vision'));
    plugins.push(require(`./${mode}Routes.js`));

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
    // Load widgets
    plugins = widgets(plugins, mode === 'server' ? 'index' : 'helper');

    return plugins;
};

module.exports = loadPlugins;