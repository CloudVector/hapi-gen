"use strict";

const pkg = require('../package.json');
const files = require('./files.js');
const WIDGETS_FOLDER = 'widgets';

/* Load widgets */
const loadWidgets = (plugins, filename) => {
    let list = files.directories([__dirname, '..', WIDGETS_FOLDER].join('/'));
    /* Register ALL widgets */
    //console.log('Loading plugins...');
    list.forEach((folder) => {
        let file = ['../', WIDGETS_FOLDER, '/', folder, '/', filename, '.js'].join('');
        try {
            var plugin = require(file);
            plugins.push(plugin);
            //console.log('  ' + folder.toUpperCase());
        }
        catch (e) {
            console.error(e);
        }
    });
    return plugins;
};

/* Load plugins */
const loadPlugins = (mode) => {
    let plugins = [];

    // Add plugins required for hapi to work properly with swagger and static folders
    plugins.push(require('inert'));
    plugins.push(require('vision'));
    // Load routes
    plugins.push(require(`./${mode}-routes.js`));

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
    plugins = loadWidgets(plugins, mode === 'server' ? 'index' : 'helper');

    return plugins;
};

module.exports = loadPlugins;