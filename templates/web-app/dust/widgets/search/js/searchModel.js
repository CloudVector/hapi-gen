/*global window */
"use strict";

var isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var tools = isNode ? require('../../../src/js/tools.js') : window.hiso.tools;
var SearchItemModel = isNode ? require('./searchItemModel.js') : window.hiso.SearchItemModel;

/**
* Navigation Model
* @class SearchModel
* @constructor
*/
var SearchModel = function (data) {
    var self = this;
    // Assign data
    tools.assign(self, data);
    // Load resources
    tools.property(self, 'res', tools.resources('search'));
    // Create items
    if (data.items) {
        self.items = tools.model(data.items, SearchItemModel);
    }
};

if (isNode) {
    module.exports = SearchModel;
} else {
    window.hiso = window.hiso || {};
    window.hiso.SearchModel = SearchModel;
}