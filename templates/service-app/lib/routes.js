"use strict";

const pkg = require('../package.json');

module.exports.plugin = {
    register: (server) => {
        server.route([
        {
            method: 'GET',
            path: '/',
            handler: () => {
                let model = {
                    name: pkg.name,
                    version: pkg.version,
                    description: 'Welcome to HAPI based micro-service',
                    documentation: 'For documentation call service endpoint: /docs'
                };
                return model;
            },
            options: {
                auth: false,
                tags: ['welcome']
            },
        }
    ]);
},
    name: 'routes',
    version: '1.0.0'
};