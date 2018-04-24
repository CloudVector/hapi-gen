"use strict";

const NavigationModel = require('./js/navigationModel.js');

module.exports.plugin = {
    register: (server) => {
        // Routes setup
        server.route([
        {
            path: '/navigation/html',
            method: 'GET',
            handler: (request, h) => {
                model = h.createModel(server, NavigationModel);
                return h.renderView('navigation', model);
            },
            options: {
                auth: false,
                tags: ['navigation', 'html'],
                description: 'Navigation HTML content'
            }
        }
    ]);
},
    name: 'navigation',
    version: '1.0.0'
};