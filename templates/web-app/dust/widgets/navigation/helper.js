"use strict";

const joi = require('joi');
const path = require('path');

module.exports.plugin = {
    register: (server) => {
        // Routes setup
        server.route([
        {
            path: '/navigation/test/{file*}',
            method: 'GET',
            handler: (request, h) => {
                return h.renderView(request.params.file);
            },
            options: {
                auth: false,
                validate: {
                    params: {
                        file: joi.string().default('navigation-test')
                    }
                },
                tags: ['navigation', 'html', 'test'],
                description: 'Navigation test web pages'
            }
        },
        {
            method: 'GET',
            path: '/navigation/assets/{file*}',
            handler: (request, h) => {
                return h.file(path.join(__dirname, request.params.file));
            },
            options: {
                auth: false,
                tags: ['navigation','assets', 'test'],
                description: 'Navigation test assets endpoint'
            }
        }
    ]);
},
    name: 'navigation',
    version: '1.0.0'
};