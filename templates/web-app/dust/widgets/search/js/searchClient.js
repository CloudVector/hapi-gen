/*global $, window, JSON */

/**
* JavaScript client for the search widget
*
* @class SearchClient
* @constructor
*/
var SearchClient = function (options) {
    var self = this,
    isObject,
    clearEmpty,
    getDefaults;

    /**
    * Options
    * @property options
    */
    self.options = options || {};
    self.options.id = self.options.id || 'hapi-iso'; // Default client id

    /* Creates default AJAX settings */
    getDefaults = function () {
        var result = {
            type: 'GET',
            contentType: 'application/json; charset=utf-8'
        };
        return result;
    };

    /* Checks if object actually is a subcomponent */
    isObject = function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Object]');
    };

    /* Clears empty data tags from objects */
    clearEmpty = function (obj) {
        obj = obj || {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] === undefined || obj[key] === null) {
                    delete obj[key];
                }
                // Clear sub components as well
                if (isObject(obj[key])) {
                    obj[key] = clearEmpty(obj[key]);
                }
                if (Array.isArray(obj[key])) {
                    var list = [];
                    for (var i = 0, len = obj[key].length; i < len; i++) {
                        var item = obj[key][i];
                        if (item !== undefined || item !== null) {
                            if (isObject(item)) {
                                item = clearEmpty(item);
                            }
                            list.push(item);
                        }
                    }
                }
            }
        }
        return obj;
    };

    /**
    * Get contact list
    * @param {object} payload
    * @param {function} resolve (success) callback
    * @param {function} reject (error) callback
    * @method search
    */
    self.search = function (payload, resolve, reject) {
        reject = reject || window.hiso.log.error;
        var cfg = getDefaults();
        payload = clearEmpty(payload);
        cfg.type = 'POST';
        cfg.data = JSON.stringify(payload);
        cfg.success = resolve;
        cfg.error = reject;
        $.ajax(['/api/search?client_id=', self.options.id].join(''), cfg);
    };

    /**
    * Get contact detail
    * @param {string} id
    * @param {function} success callback
    * @param {function} error callback
    * @method detail
    */
    self.detail = function (id, resolve, reject) {
        reject = reject || window.hiso.log.error;
        var cfg = getDefaults();
        cfg.type = 'GET';
        cfg.success = resolve;
        cfg.error = reject;
        $.ajax(['/api/search-detail/', id, '?client_id=', self.options.id].join(''), cfg);
    };

    /**
    * Get suggesstions
    * @param {string} text
    * @param {function} success callback
    * @param {function} error callback
    * @method suggestion
    */
    self.suggestion = function (text, resolve, reject) {
        reject = reject || window.hiso.log.error;
        var cfg = getDefaults();
        cfg.type = 'GET';
        cfg.success = resolve;
        cfg.error = reject;
        $.ajax(['/api/suggestions?client_id=', self.options.id, '&text=', text.toLowerCase()].join(''), cfg);
    };
};

window.hiso = window.hiso || {};
window.hiso.SearchClient = SearchClient;