'use strict';

// Set default ports
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const Hapi = require('hapi');
const Boom = require('boom');
const plugins = require('./plugins.js');
const loadSettings = require('./settings.js');

let port = parseInt(process.env.PORT, 10);
let host = 'localhost'; // process.env.IP;
let settings = {
    close: () => {}
};
let dbmodule = null;

// Primary server
const server = Hapi.server({
    port: port,
    host: host,
    routes: {
        validate: {
            failAction: async (request, h, err) => {
                if (process.env.NODE_ENV === 'production') {
                    // In prod, log a limited error message and throw the default Bad Request error.
                    console.error('ValidationError:', err.message); // Better to use an actual logger here.
                    throw Boom.badRequest(`Invalid request payload input`);
                } else {
                    // During development, log and respond with the full error.
                    console.error(err);
                    throw err;
                }
            }
        }
    }
});

// Initialize 
const init = async () => {
    // Load settings
    settings = await loadSettings(dbmodule); // Get all the flags, repositories and DB connection
    server.settings.app = settings; // Assign settings to SERVER to store reference

    // Start registration
    await server.register(plugins);
    // Load views
    // Start servers
    await server.start();
 
    // Display console
    console.log('Server running at:', server.info.uri);
};

// Event handlers
process.on('unhandledRejection', (err) => {
    console.error(err);
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