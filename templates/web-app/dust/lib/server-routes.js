"use strict";

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
                return h.file(path.join('public/css', request.params.file),{ lookupCompressed: true }).header('cache-control', 'max-age=' + settings.MAX_AGE);
            },
            options: {
                auth: false,
                description: "Serve css styles",
                validate: {
                    params: {
                        file: joi.string().regex(/^vendor-\d+.\d+.\d+.min.css|client-\d+.\d+.\d+.min.css|authenticate.min.css/)
                    }
                },
                tags: ['assets', 'css']
            }
        },
        {
            method: "GET",
            path: "/scripts/{file*}",
            handler: (request, h) => {
                return h.file(path.join('public/js', request.params.file), { lookupCompressed: true }).header('cache-control', 'max-age=' + settings.MAX_AGE);
            },
            options: {
                auth: false,
                description: "Serve js scripts",
                validate: {
                    params: {
                        file: joi.string().regex(/^vendor-\d+.\d+.\d+.min.js|client-\d+.\d+.\d+.min.js|client-\d+.\d+.\d+.js|views-\d+.\d+.\d+.min.js/)
                    }
                },
                tags: ['assets', 'js']
            }
        },
        {
            method: "GET",
            path: "/images/{file*}",
            handler: (request, h) => {
                return h.file(path.join('public/img', request.params.file)).header('cache-control', 'max-age=' + settings.MAX_AGE);
            },
            options: {
                auth: false,
                description: "Serves static images",
                validate: {
                    params: {
                        file: joi.string().regex(/^.*\.(ico|bmp|tif|tiff|gif|jpeg|jpg|jif|jfif|jp2|jpx|j2k|j2c|fpx|pcd|png|svg|)$/)
                    }
                },
                tags: ['assets', 'images']
            }
        },
        {
            method: "GET",
            path: "/fonts/{file*}",
            handler: (request, h) => {
                return h.file(path.join('public/font', request.params.file)).header('cache-control', 'max-age=' + settings.MAX_AGE);
            },
            options: {
                auth: false,
                description: "Serves font resources",
                validate: {
                    params: {
                        file: joi.string().regex(/^.*\.(ttf|woff|woff2)$/)
                    }
                },
                tags: ['assets', 'fonts']
            }
        },
        {
            method: 'GET',
            path: '/favicon.png',
            handler: (request, h) => {
                h.file('public/img/favicon.ico');
            },
            options: {
                tags: ['web']
            }
        }
    ]);
},
    name: 'server-routes',
    version: '1.0.0'
};