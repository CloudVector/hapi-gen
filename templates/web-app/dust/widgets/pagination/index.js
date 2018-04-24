"use strict";

module.exports.plugin = {
    register: (server) => {
        server.route([
        {
            path: '/pagination/html',
            method: 'GET',
            handler: (request, h) => {
                return h.renderView('pagination');
            },
            options: {
                auth: false,
                tags: ['pagination', 'html'],
                description: 'Pagination HTML content'
            }
        }
    ]);
},
    name: 'pagination',
    version: '1.0.0'
}