'use strict';

const RepositoryBase = require('./../../lib/repository-base.js');
const internals = {};

/* Calculates page offset */
internals.skip = (page, size) => {
    var result = 0;
    if (page > 1) {
        result = (page -1) * size;
    }
    return result;
};

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
    * Save 
    * @method save
    * @param {String} type 
    * @param {Object} payload
    * @return {Object} with success boolean flag set for operation result
    */
    save (type, payload) {
        let result = { success: true };
        return result;
    }

    /*
    * Returns the list (filtered)
    * @method list 
    * @param {Object} search parameters
    * @return {Object} result object
    */
    list (search) {
        let result = {
            page: search.page,
            size: search.size,
            sort: search.sort,
            count: 0,
            total: 0,
            items: []
        };
        let query = {};
        let options = {};

        if (search.name) {
            query.name = search.name;
        }
        if (search.page && search.limit) {
            options.limit = search.limit;
            options.skip = internals.skip(search.page, search.size);
        }

        // Add sort, no limit for this task
        options.sort = search.sort;
        // Execute search
        return result;
    }

    /*
    * Return a single item
    * @method find
    * @param {String} id 
    * @return {Object} JSON document
    */
    find (id) {
        let result = {};
        return result;
    }

    /*
    * Remove a single item
    * @method remove
    * @param {String} id
    * @return {Object} with success boolean flag set for operation result
    */
    remove (id) {
        let result = { success: true };
        return result;
    }
}

module.exports = Repository; 