/*global window */
"use strict";

var isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var bimo = isNode ? require('bimo') : window.bimo;

/**
* Pagination Model
* @class PaginationModel
* @constructor
*/
var PaginationModel = function (data) {
    // Set defaults
    data = data || {};
    data.page = data.page || 1;
    data.size = data.size || 10;
    data.total = data.total || 0;
    data.count = data.count || this.getPageCount(data.total, data.size);
    bimo.Model.call(this, data);
};

PaginationModel.prototype = Object.create(bimo.Model.prototype);
PaginationModel.constructor = bimo.Model;

/**
* Check if value is empty 
* @method isEmpty
* @param {Any} value
* @return {Boolean} true if value is undefined, null or empty string
*/
PaginationModel.prototype.isEmpty = function (value) {
    return (value === undefined || value === null || value === '');
};

/**
* Calculates page count 
* @method getPageCount
* @param {Number} total - total number of record available
* @param {Number} size - page size
* @return {Number} number of pages used in the pagination
*/
PaginationModel.prototype.getPageCount = function (total, size) {
    var result = 0;
    if (total > 0 && size > 0) {
        result = Math.ceil(total / size);
    }
    return result;
};

/**
* Moves page to first 
* @method first
* @return {Undefined}
*/
PaginationModel.prototype.first = function () {
    this.page = 1;
};

/**
* Moves page to next
* @method next
* @return {Undefined}
*/
PaginationModel.prototype.next = function () {
    if (this.page < this.count) {
        this.page++;
    }
};

/** 
* Moves page to previous
* @method prev
* @return {Undefined}
*/
PaginationModel.prototype.prev = function () {
    if (this.page > 1) {
        this.page--;
    }
};

/**
* Moves page to last
* @method last
* @return {Undefined}
*/
PaginationModel.prototype.last = function () {
    this.page = this.count;
};

/*
* Skip to selected page
* @method go
* @return {Undefined}
*/
PaginationModel.prototype.go = function (page) {
    page = parseInt(page, 10);
    if (page <= this.count && page >= 1) {
        this.page = page;
    }
};

/*
* Update multiple properties
* @method update
* @return {Undefined}
*/
PaginationModel.prototype.update = function (data) {
    this.page = data.page || this.page;
    this.size = data.size || this.size;
    this.count = data.count || this.count;
    this.total = data.total || this.total;
};

if (isNode) {
    module.exports = PaginationModel;
} else {
    window.hiso = window.hiso || {};
    window.hiso.PaginationModel = PaginationModel;
}