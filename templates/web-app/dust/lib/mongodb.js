'use strict';

const config = require('config');
const MongoClient = require('mongodb').MongoClient;

module.exports = async () => {
    let result = {
        db: null,
        close: null
    };
    // Connect
    try {
        let client = await MongoClient.connect(config.database.mongodb.url);
        let db = client.db(config.database.mongodb.dbname);
        result.db = db;
        result.close = () => {
            client.close();
        };
    } catch (err) {
        console.error('Failed to connect to mongoDb: ', err);
        process.exit(1);
    }
    return result;
};