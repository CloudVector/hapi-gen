'use strict';

const config = require('config');
const elasticsearch = require('elasticsearch');

module.exports = () => {
    return new Promise((resolve) => {
        let result = {
            db: null,
            close: null
        };
        // Connect
        let db = new elasticsearch.Client(config.database.elasticsearch);
        result.db = db;
        result.close = () => {
            // Nothing to do here
        };
        resolve(result);
    });
};