"use strict";

const joi = require('joi');
const Boom = require('boom');
const validation = require('./js/validation.js');

module.exports.plugin = {
    register: (server) => {
        // Routes setup
        server.route([
        {
            path: '/search',
            method: 'GET',
            handler: async (request, h) => {
                try {
                    let promises = [];
                    promises.push(server.app.facade.search.getList(request.query));
                    promises.push(server.app.facade.navigation.getModel());
                    let res = await Promise.all(promises);
                    let model = res[0];
                    model.navigation = res[1];
                    model = h.createModel(server, null, model); // Add default flags: debug and host/helper
                    return h.renderView('search-page', model);
                } catch (err) {
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    query: validation.search
                },
                tags: ['web', 'search'],
                description: 'Search for people page'
            }
        },
        {
            path: '/api/search',
            method: 'POST',
            handler: async (request, h) => {
                try {
                    let model = await server.app.facade.search.getList(request.payload);
                    return model;
                } catch (err) {
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    payload: validation.search,
                    query: {
                        client_id: validation.client,
                        debug: validation.debug
                    }
                },
                tags: ['api', 'search', 'people'],
                description: 'Search for people'
            }
        },
        {
            path: '/api/suggestions',
            method: 'GET',
            handler: async function(request, reply) {
                try {
                    let list = await server.app.facade.search.getSuggestions(request.query.text);
                    return list;
                } catch (err) {
                    return Boom.boomify(err, { statusCode: 400 });
                }
            },
            options: {
                auth: false,
                validate: {
                    query: {
                        text: joi.string().required().description('Suggestion fragement'),
                        client_id: validation.client,
                        debug: validation.debug
                    }
                },
                tags: ['api', 'suggest', 'people'],
                description: 'Provides suggestions for people search'
            }
        },
        {
            path: '/search/html',
            method: 'GET',
            handler: (request, h) => {
                model = h.createModel(server);
                return h.renderView('search', model);
            },
            options: {
                auth: false,
                tags: ['search', 'html'],
                description: 'Search HTML content'
            }
        }
    ]);
},
    name: 'search',
    version: '1.0.0'
};