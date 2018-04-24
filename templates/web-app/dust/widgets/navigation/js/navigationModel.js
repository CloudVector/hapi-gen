/*global window */
"use strict";

var isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var tools = isNode ? require('../../../src/js/tools.js') : window.hiso.tools;

/**
* Navigation Model
* @class NavigationModel
* @constructor
*/
var NavigationModel = function (data) {
    var self = this,
    res = tools.resources('navigation');
    tools.assign(self, data);
    // Load menu items
    self.items = [];
    for (var key in res) {
        if (res.hasOwnProperty(key)) {
            self.items.push({
                url: '/' + key, // Simple solution for now
                name: key,
                label: res[key],
                active: key === 'banana' ? ' active' : ''
            });
        }
    }
};

if (isNode) {
    module.exports = NavigationModel;
} else {
    window.hiso = window.hiso || {};
    window.hiso.NavigationModel = NavigationModel;
}