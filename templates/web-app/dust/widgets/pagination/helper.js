"use strict";

const joi = require('joi');
const path = require('path');

module.exports.plugin = {
    register: (server) => {
        // Routes setup
        server.route([
        {
            path: '/pagination/test/{file*}',
            method: 'GET',
            handler: (request, h) => {
                return h.renderView(request.params.file);
            },
            options: {
                auth: false,
                validate: {
                    params: {
                        file: joi.string().default('pagination-test')
                    }
                },
                tags: ['pagination', 'html', 'test'],
                description: 'Pagination test web pages'
            }
        },
        {
            method: 'GET',
            path: '/pagination/assets/{file*}',
            handler: (request, h) => {
                return h.file(path.join(__dirname, request.params.file));
            },
            options: {
                auth: false,
                tags: ['pagination', 'assets', 'test'],
                description: 'Pagination test assets endpoint'
            }
        }
    ]);
},
    name: 'pagination',
    version: '1.0.0'
};