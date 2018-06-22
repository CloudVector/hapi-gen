"use strict";

const Boom = require('boom');
const valid = require('./validation.js');

module.exports.plugin = {
    register: (server) => {
        // Get repository 
        const repo = server.settings.app.facade.sample;
        // Routes setup
        server.route([
        {
            path: '/api/sample',
            method: 'GET',
            handler: async (request, h) => {
                try {
                    return await repo.list();
                } catch (err) {
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    query: valid.list
                },
                tags: ['api', 'sample'],
                description: 'List sample'
            }
        },
        {
            path: '/api/sample/{type}',
            method: 'POST',
            handler: async (request, h) => {
                try {
                    return await repo.save(request.params.type, request.payload);
                } catch (err) {
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    params: valid.type,
                    payload: valid.add
                },
                tags: ['api', 'sample'],
                description: 'Save sample'
            }
        },
        {
            path: '/api/sample/{id}',
            method: 'GET',
            handler: async (request, h) => {
                try {
                    return await repo.find(request.params.id);
                } catch (err) {
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    params: valid.id
                },
                tags: ['api', 'sample'],
                description: 'Get a sample'
            }
        },
        {
            path: '/api/sample/{id}',
            method: 'DELETE',
            handler: async (request, h) => {
                try {
                    return await repo.remove(request.params.id);
                } catch (err) {
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    params: valid.id
                },
                tags: ['api', 'sample'],
                description: 'Delete a sample'
            }
        }
    ]);
},
    name: 'sample',
    version: '1.0.0'
};