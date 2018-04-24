'use strict';

const config = require('config');
const mysql = require('mysql');

module.exports = () => {
    return new Promise((resolve, reject) => {
        let result = {
            db: null,
            close: null
        };
        // Connect
        let db = mysql.createconnection(config.database.mysql);
        result.db = db;
        result.close = () => {
            db.end();
        };
        db.connect((err) => {
            reject(err);
        });
        resolve(result);
    });
};