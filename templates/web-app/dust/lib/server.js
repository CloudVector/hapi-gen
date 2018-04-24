'use strict';

const Hapi = require('hapi');
const boom = require('boom');
const dust = require('dustjs-linkedin');
const fs = require("fs");
const path = require('path');
const loadPlugins = require('./plugins.js');

// Set default ports
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

let port = parseInt(process.env.PORT, 10);
let host = process.env.IP;

// Primary server
const server = Hapi.server({
    port: port,
    host: host
});

// Secondary internal helper server
const helper = Hapi.server({
    port: (port + 1),
    host: host
});

// Create a model with default global values
const createModel = (server, ModelClass, data) => {
    data = data || {};
    data.debug = data.debug === undefined ? server.app.debug : data.debug;
    if (server.app.debug) {
        data.host = server.app.host;
        data.helper = server.app.helper;
    }
    let result = data;
    if (ModelClass !== undefined && ModelClass !== null) {
        console.log(ModelClass);
        result = new ModelClass(data);
    }
    return result;
};

const renderView = (view, model) => {
    model = model || {};
    return new Promise((resolve, reject) => {
        dust.render(view.toLowerCase().indexOf('.dust') === -1 ? (view + '.dust') : view, model, (err, out) => {
            if (err !== null) {
                reject(boom.badRequest(err.message));
            } else {
                resolve(out);
            }
        });
    });
};

const init = async () => {
    // Start registration
    let serverPlugins = loadPlugins('server');
    let helperPlugins = loadPlugins('helper');
    let s = server.register(serverPlugins);
    let h = helper.register(helperPlugins);
    // Wait for registration to complete
    await Promise.all([s, h]);
    console.log('Plugin registrations completed');
    
    // Load views
    let dustViews = fs.readFileSync("./lib/views.min.js");
    dust.loadSource(dustViews);
    console.log('Views loaded to cache');

    // Start servers
    s = server.start();
    h = helper.start();
    // Waif for start to complete
    await Promise.all([s, h]);

    // Add view rendering method and model creation to handler
    server.decorate('toolkit', 'renderView', renderView);
    server.decorate('toolkit', 'createModel', createModel);
    helper.decorate('toolkit', 'renderView', renderView);
    helper.decorate('toolkit', 'createModel', createModel);
    // Create settings
    let settings = {
        debug: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev'),
        appPath: path.join(__dirname, '..'),
        host: server.info.uri,
        helper: helper.info.uri,
        facade: require('./facade.js')
    };

    // Assign global variables to SERVER 
    server.settings.app = settings;
    // Assign global variables to HELPER
    helper.settings.app = settings;

    // Display console
    console.log(`Server running at: ${server.info.uri}`);
    console.log(`Helper running at: ${helper.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();