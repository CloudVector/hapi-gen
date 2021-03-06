"use strict";

const files = require('./files.js');
const pkg = require('../package.json');
const path = require('path');
const joi = require('joi');

module.exports.plugin = {
    register: (server) => {
        // Get settings
        const settings = server.settings.app;
        // Register routes
        server.route([
        {
            method: "GET",
            path: "/styles/{file*}",
            handler: (request, h) => {
                return h.file(path.join(settings.path, 'node_modules', request.params.file),{ lookupCompressed: true }).header('cache-control', 'max-age=1');
            },
            options: {
                auth: false,
                description: "Serve css styles",
                validate: {
                    params: {
                        file: joi.string()
                    }
                },
                tags: ['assets', 'css']
            }
        },
        {
            method: "GET",
            path: "/scripts/{file*}",
            handler: (request, h) => {
                return h.file(path.join(settings.path, 'node_modules', request.params.file), { lookupCompressed: true }).header('cache-control', 'max-age=1');
            },
            options: {
                auth: false,
                description: "Serve js scripts",
                validate: {
                    params: {
                        file: joi.string()
                    }
                },
                tags: ['assets', 'js']
            }
        },
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                let model = {
                    name: pkg.name,
                    version: pkg.version,
                    vendorVersion: pkg.vendorVersion,
                    widgets: files.directories(path.join(__dirname, '/../widgets'))
                };
                return h.renderView('tests', model);
            },
            options: {
                auth: false,
                tags: ['test', 'web']
            },
        }
    ]);
},
    name: 'helper-routes',
    version: '1.0.0'
};