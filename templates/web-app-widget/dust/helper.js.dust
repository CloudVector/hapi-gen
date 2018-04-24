"use strict";

const joi = require('joi');

module.exports.plugin = {
    register: (server) => {
        // Routes setup
        server.route([
        {
            path: '/search/test/{file*}',
            method: 'GET',
            handler: (request, h) => {
                return h.renderView(request.params.file);
            },
            options: {
                auth: false,
                validate: {
                    params: {
                        file: joi.string().default('search-test')
                    }
                },
                tags: ['search', 'html', 'test'],
                description: 'Search test web pages'
            }
        },
        {
            method: 'GET',
            path: '/search/assets/{param*}',
            handler: (request, h) => {
                return h.file(path.join(__dirname, 'search', request.params.file));
            },
            options: {
                auth: false,
                tags: ['search','assets', 'test'],
                description: 'Search test assets endpoint'
            }
        }
    ]);
},
    name: 'search',
    version: '1.0.0'
};