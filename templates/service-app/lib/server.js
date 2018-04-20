'use strict';

// Set default ports
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const Hapi = require('hapi');
const plugins = require('./plugins.js');
const loadSettings = require('./settings.js');

let port = parseInt(process.env.PORT, 10);
let host = 'localhost'; // process.env.IP;
let settings = null;

// Primary server
const server = Hapi.server({
    port: port,
    host: host
});

// Initialize 
const init = async () => {
    // Load settings
    settings = await loadSettings(); // Get all the flags, repositories and DB connection
    server.settings.app = settings; // Assign settings to SERVER to store reference

    // Start registration
    await server.register(plugins);
    // Load views
    // Start servers
    await server.start();
 
    // Display console
    console.log(`Server running at: ${server.info.uri}`);
};

// Closing DB 
const close = () => {
    if (settings.database !== null) {
        console.log('Closing connection to database...');
        settings.database.close();
    }
}

// Event handlers
process.on('unhandledRejection', (e) => {
    console.log(e);
    close();
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log("Shutting down...");
    close();
    process.exit();
});

// Start service
init();