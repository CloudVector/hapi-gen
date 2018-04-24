"use strict";

const NavigationModel = require('./navigationModel.js');

/**
* Repository client for navigation widget
*
* @class Repository
* @constructor
*/
class Repository {

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