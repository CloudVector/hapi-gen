"use strict";

const folders = require('./folders');
const path = require('path');
const PLUGINS_FOLDER = 'plugins';
const config = require('config');
//const MongoClient = require('mongodb').MongoClient;

const settings = async () => {
    let list = await folders(path.join(__dirname, '/../', PLUGINS_FOLDER));
    let result = {
        debug: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev'),
        path: path.join(__dirname, '..'),
        client: null,
        db: null, 
        facade: {}
    };

    // Add mongoDb connection (this app using a single DB), remove comment if required
    /*
    try {
        result.database = await MongoClient.connect(config.db.url);
        result.db = result.database.db(config.db.dbname);
    } catch (e) {
        console.error('Failed to connect to mongoDb: ', e);
        process.exit(1);
    }
    */

    // Run for all widget look for repositories
    //console.log('Registering repositories...');
    list.forEach((folder) => {
        let repo = ['..', PLUGINS_FOLDER, folder, 'repository.js'].join('/');
        try {
            let Repository = require(repo);
            result.facade[folder] = new Repository(result.db);
            //console.log('Repository: ' + folder.toUpperCase());
        }
        catch (e) {
            if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf('/repository.js') > -1) {
                console.log('skip: ' + folder.toUpperCase());
            } else {
                console.error(e);
            }
        }
    });
    return result;
}

module.exports = settings;