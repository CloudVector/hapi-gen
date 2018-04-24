"use strict";

const files = require('./files.js');
const path = require('path');
const WIDGETS_FOLDER = 'widgets';

const settings = async (dbmodule) => {
    let list = files.directories(path.join(__dirname, '..', WIDGETS_FOLDER));
    let debug = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev');
    let result = {
        debug: debug,
        MAX_AGE: (debug ? 1 : 31536000), // DEV: 1 sec, PROD: 1 year
        path: path.join(__dirname, '..'),
        db: null,
        close: () => {},
        facade: {}
    };

    // Initialize database if module is specified
    if (dbmodule !== null) {
        let initDb = require(dbmodule);
        let tmp = await initDb();
        result.db = tmp.db;
        result.close = tmp.close;
    }

    // Run for all widget look for repositories
    //console.log('Registering repositories...');
    list.forEach((dir) => {
        let repo = path.join(__dirname, '..', WIDGETS_FOLDER, dir, '/js/repository.js');
        try {
            let Repository = require(repo);
            result.facade[dir] = new Repository(result.db);
            //console.log('Repository: ' + dir.toUpperCase());
        }
        catch (err) {
            if (err.code === 'MODULE_NOT_FOUND' && err.message.endsWith('repository.js') > -1) {
                console.log('skipped: ' + dir.toUpperCase());
            } else {
                console.error(err);
            }
        }
    });
    return result;
}

module.exports = settings;