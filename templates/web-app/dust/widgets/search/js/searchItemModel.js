/*global window, module */
"use strict";

var isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var tools = isNode ? require('../../../src/js/tools.js') : window.hiso.tools;

/**
* Single item model
* @class SearchItemModel
* @constructor
*/
var SearchItemModel = function (data) {
    var self = this;
    // Assign property
    tools.property(self, 'res', tools.resources('search', 'list'));
    tools.assign(self, data);
};

/* Provides initals for contact icon */
SearchItemModel.prototype.initials = function () {
    var self = this;
    return tools.initials(self.firstName, self.lastName);
};

/* Provides full name */
SearchItemModel.prototype.fullName = function () {
    var self = this,
    result;
    if (self.firstName && self.lastName) {
        result = tools.fullName(self.firstName, self.lastName);
        if (self.search && self.search !== '') {
            var pos = result.toLowerCase().indexOf(self.search.toLowerCase());
            if (pos > -1) {
                // Get the sample out with the proper casing from the original
                var temp = result.substr(pos, self.search.length);
                // Replace it with bold
                result = tools.replaceAll(result, temp, ['<b>', temp, '</b>'].join(''));
            }
        }
    }
    return result;
};

/* Display phone number */
SearchItemModel.prototype.displayPhone = function () {
    var self = this,
    result;
    if (self.phone) {
        result = tools.formatPhone(self.phone);
    }
    return result;
};

/* Display income */
SearchItemModel.prototype.displayIncome = function () {
    var self = this,
    result;
    if (self.income) {
        result = tools.shortNumber(self.income);
    }
    return result;
};

/* Generate address */
SearchItemModel.prototype.address = function () {
    var self = this,
    result = [];
    if (self.street) {
        result.push(self.street + ',');
    }
    if (self.city) {
        result.push(self.city);
    }
    if (self.region) {
        result.push(self.region);
    }
    if (self.postalCode) {
        result.push(self.postalCode);
    }
    if (self.country) {
        result.push('- ' + self.country);
    }
    return result.join(' ');
};

/* Create comment to display with default value */
SearchItemModel.prototype.comment = function () {
    var self = this,
    result = 'N/A';
    if (self.note) {
        result = self.note;
    }
    return result;
};

if (isNode) {
    module.exports = SearchItemModel;
} else {
    window.hiso = window.hiso || {};
    window.hiso.SearchItemModel = SearchItemModel;
}