"use strict";

const NavigationModel = require('./js/navigationModel.js');

module.exports.plugin = {
    register: (server) => {
        // Get repository
        const repo = server.settings.app.facade.navigation;
        // Routes setup
        server.route([
        {
            path: '/navigation/html',
            method: 'GET',
            handler: async (request, h) => {
                let model = await repo.getModel();
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