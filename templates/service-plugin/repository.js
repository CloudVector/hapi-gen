'use strict';

const RepositoryBase = require('../../lib/repository-base.js');

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

    /*
    * Get a single entity
    * @method load
    * @param {string} id
    * @return {Object} result
    */
    load (id) {
        let result = {}; // read entity here
        return result;
    }

    /*
    * Get a list of entities
    * @method list
    * @param {Object} params
    * @return {Object} result
    */
    list (params) {
        let result = {}; // Load list of entities here
    }

    /*
    * Save entity
    * @method add
    * @param {Object} payload (entity or entities)
    * @return {Object} result
    */
    add (payload) {
        let result = {}; // create entity here and save it
        return result;
    }

    /*
    * Update entity
    * @method update
    * @param {Object} payload (entity or entities)
    * @return {Object} result
    */
    update (payload) {
        let result = {}; // create entity here and save it
        return result;
    }

    /*
    * Remove a single entity
    * @method remove
    * @param {String} id
    * @return {Object} with success boolean flag set for operation result
    */
    remove (id) {
        let result = { success: true }; // delete here
        return result;
    }
}

module.exports = Repository; 