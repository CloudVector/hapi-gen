"use strict";

const RepositoryBase = require('../../../lib/repository-base.js');
const NavigationModel = require('./navigationModel.js');

/*
* Data operation component
* Note: convert any method to async function as required
* @class Repository
* @constructor
* @extends RepositoryBase
*/
class Repository extends RepositoryBase {
    /*
    * Constructor to receive database (or other) options
    */
    constructor (db) {
        super(db);
    }

    /**
    * Returns model for view
    *
    * @method getModel
    * @param {string} role - user selected role
    * @param {string} selected - selected menu item
    * @return {Promise} object of NavigationModel
    */
    getModel () {
        return new Promise((resolve, reject) => {
            try {
                let model = new NavigationModel();
                resolve(model);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = Repository;