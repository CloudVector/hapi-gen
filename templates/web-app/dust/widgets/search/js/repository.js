"use strict";

const SearchModel = require('./searchModel.js');
const tools = require('../../../src/js/tools.js');
const internals = {};

/* Calculates page offset */
internals.getOffset = function getOffset (page, size) {
    var result = 0;
    if (page > 1) {
        result = (page -1) * size;
    }
    return result;
};

/* Get sorting method */
internals.getSortMethod = function getSortMethod (sort) {
    var result;
    if (sort === 'name-az') {
        result = function (a, b) {
            if (a.firstName > b.firstName) {
                return 1;
            }
            if (a.firstName < b.firstName) {
                return -1;
            }
            // a must be equal to b
            return 0; 
        };
    } else if (sort === 'name-za') {
        result = function (a, b) { 
            if (b.firstName > a.firstName) {
                return 1;
            }
            if (b.firstName < a.firstName) {
                return -1;
            }
            // a must be equal to b
            return 0; 
        };
    }
    return result;
};


/* Mock search filter */
internals.filter = function filter (search, item) {
    var result = true,
    contains = function (field, value) {
        return (field.toLowerCase().indexOf(value.toLowerCase()) > -1);
    };
    if (search && search !== '' && item) {
        result = false;
        if (contains(item.firstName, search) || contains(item.lastName, search)) {
            result = true;
        }
    }
    return result;
};

// Load data
internals.requestList = function requestList (params) {
    params.search = params.search || '';
    return new Promise((resolve, reject) => {
        try {
            const data = require('../../../data/people.json');
            const sortFunc = internals.getSortMethod(params.sort);
            data.sort(sortFunc);
            var result = {
                pagination: {
                    page: params.page,
                    size: params.size,
                    sort: params.sort,
                    total: data.length
                },
                items: []
            };
            // Get the page
            let fr = internals.getOffset(params.page, params.size);
            let to = fr + params.size;
            to = to > data.length ? data.length : to;
            // get the data
            for (let i = fr; i < to; i++) {
                if (internals.filter(params.search, data[i])) {
                    result.items.push(data[i]);
                }
            }
            resolve(result);
        }
        catch (err) {
            reject(err);
        }
    });
};

/**
* Repository client for contacts API
*
* @class Repository
* @constructor
*/
class Repository {

    /**
    * Returns a single contact entity by id
    *
    * @method read
    * @param {string} id - entity id
    *
    * @return {Promise} object
    */
    read (id) {
        return id;
    }

    /**
    * Creates a single contact entity
    *
    * @method create
    * @param {object} entity - data to create contact
    *
    * @return {Promise} object
    */
    create (entity) {
        return entity;
    }

    /**
    * Updates a single contact entity
    *
    * @method update
    * @param {string} id - entity id
    *
    * @return {Promise} object
    */
    update (entity) {
        return entity;
    }

    /**
    * Removes a single contact entity by id
    *
    * @method remove
    * @param {string} id - entity id
    *
    * @return {Promise} object
    */
    remove (id) {
        return id;
    }

    /**
    * Returns multiple contacts based on some filters and sorting
    *
    * @method getList
    * @param {object} params - search and paging parameters
    *
    * @return {object} list of search results
    */
    async getList (params) {
        /* Get the page offset */
        let result = await internals.requestList(params);
        return new SearchModel(result);
    }

    /**
    * Returns a selected contact entity by id
    *
    * @method getSuggestions
    * @param {string} text - search text
    *
    * @return {object} object containst suggestions
    */
    async getSuggestions (text) {
        let tmp = await internals.requestList({ sort: 'name-az', page: 1, size: 10, search: text });
        let result = [];
        tmp.items.forEach(function (item) {
            result.push({
                id: item.id,
                name: tools.fullName(item.firstName, item.lastName)
            });
        });
        return result;
    }
}

module.exports = Repository;