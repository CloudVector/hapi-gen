'use strict';

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const Hapi = require('hapi');
const Boom = require('boom');
const dust = require('dustjs-linkedin');
const fs = require("fs");
const loadPlugins = require('./plugins.js');
const loadSettings = require('./settings.js');

// Set default ports
let port = parseInt(process.env.PORT, 10);
let host = 'localhost'; // process.env.IP;
let settings = {
    close: () => {}
};
let dbmodule = null;

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

/* Render view method */
const renderView = (view, model) => {
    // Set defaults for model
    model = model || {};
    model.debug = (model.debug === undefined ? settings.debug : model.debug);
    model.host = model.host || settings.host;
    model.helper = model.helper || settings.helper;
    // Render view
    return new Promise((resolve, reject) => {
        dust.render(view.toLowerCase().indexOf('.dust') === -1 ? (view + '.dust') : view, model, (err, out) => {
            if (err !== null) {
                reject(Boom.badRequest(err.message));
            } else {
                resolve(out);
            }
        });
    });
};

const init = async () => {
    // Load settings
    settings = await loadSettings(dbmodule); // Get all the flags, repositories and DB connection
    // Assign global variables to SERVER 
    server.settings.app = settings;
    // Assign global variables to HELPER
    helper.settings.app = settings;
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

    // Add url's to settings
    settings.host = server.info.uri;
    settings.helper = helper.info.uri;

    // Add view rendering method and model creation to handler
    server.decorate('toolkit', 'renderView', renderView);
    helper.decorate('toolkit', 'renderView', renderView);

    // Display console
    console.log(`Server running at: ${server.info.uri}`);
    console.log(`Helper running at: ${helper.info.uri}`);
};

// Event handlers
process.on('unhandledRejection', (err) => {
    console.log(err);
    settings.close();
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log("Shutting down...");
    settings.close();
    process.exit();
});

// Start service
init();