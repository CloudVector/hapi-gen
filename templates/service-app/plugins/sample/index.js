"use strict";

const Boom = require('boom');
const validate = require('./validate.js');

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
                    console.error(err);
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    query: validate.list
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
                    console.error(err);
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    params: validate.type,
                    payload: validate.save
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
                    console.error(err);
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    params: validate.id
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
                    console.error(err);
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    params: validate.id
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