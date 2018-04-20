"use strict";

const pkg = require('../package.json');
const path = require('path');
const tools = require('@cloudvector/tools');
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

const load = async () => {
    // Load plugins
    let list = await tools.directories(path.join(__dirname, '..', PLUGINS_FOLDER));
    /* Register ALL widgets */
    //console.log('Loading plugins...');
    list.forEach((dir) => {
            let file = path.join(__dirname, '..', PLUGINS_FOLDER, dir, 'index.js');
            try {
                var plugin = require(file);
                plugins.push(plugin);
                console.log('  Loaded: ' + dir.toUpperCase() + '  plugin...');
            } catch (err) {
                console.error(err);
            }
    });
};

load();

module.exports = plugins;