"use strict";

const joi = require('joi');
const pkg = require('../../package.json');

module.exports.plugin = {
    register: (server) => {
        server.route([
        {
            path: '/pagination/html',
            method: 'GET',
            handler: (request, h) => {
                let model = h.createModel(server);
                return h.renderView('pagination-default', model);
            },
            options: {
                auth: false,
                tags: ['pagination', 'html'],
                description: 'Pagination HTML content'
            }
        }
    ]);
},
    pkg: pkg
}