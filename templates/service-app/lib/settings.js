"use strict";

const files = require('./files.js');
const path = require('path');
const PLUGINS_FOLDER = 'plugins';

const settings = async (dbmodule) => {
    let list = files.directories(path.join(__dirname, '..', PLUGINS_FOLDER));
    let result = {
        debug: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev'),
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
        let repo = path.join(__dirname, '..', PLUGINS_FOLDER, dir, 'repository.js');
        try {
            let Repository = require(repo);
            let name = files.toCamelCase(dir);
            result.facade[name] = new Repository(result.db);
            //console.log('Repository: ' + dir.toUpperCase());
        }
        catch (e) {
            if (e.code === 'MODULE_NOT_FOUND' && e.message.endsWith('repository.js') > -1) {
                console.log('skipped: ' + dir.toUpperCase());
            } else {
                console.error(e);
            }
        }
    });
    return result;
}

module.exports = settings;