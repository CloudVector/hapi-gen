/*global window */
"use strict";

var isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var RESOURCES = isNode ? require('../../lib/resources.js') : window.hiso.resources;
// Create tools object
var tools = {};

/**
* Creates a GUID like id
* Generates a random Guid like 16 digit id.
*
* @method guid
* @param {number} count - if specified the length of the generated value (default is 16)
* @return {string} unique id
*/
tools.guid = function (count) {
    count = count === undefined ? 16 : count;
    var tmp = new Array(count+1).join("x");
    return tmp.replace(/x/g, function () { return Math.floor(Math.random() * count).toString(count).toUpperCase(); });
};

/**
* Assigns properties to model
* @method assign
* @param {object} obj target 
* @param {object} data source
* @return {undefined}
*/
tools.assign = function (obj, data) {
    data = data || {};
    // Assign to model
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            obj[key] = data[key];
        }
    }
};

/**
* Adds readonly, not enumerable property (it does not get stringified!)
* @method property
* @param {object} obj target
* @param {string} name of the property
* @param {any} value of any type
* @return {undefined}
*/
tools.property = function (obj, name, value) {
    Object.defineProperty(obj, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
    });
};

/**
* Creates a model by checking object or array sent and if not specified type then it creates one by passing in the object into the class
* @method model
* @param {object} obj single object or array of objects
* @param {class} ModelClass type to check the object against and create it
* @return {object} model instance of model class
*/
tools.model = function (obj, ModelClass) {
    var result;
    if (obj) {
        if (Array.isArray(obj)) {
            result = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                result.push((obj[i] instanceof ModelClass) ? obj[i] : new ModelClass(obj[i]));
            }
        } else {
            result = (obj instanceof ModelClass) ? obj : new ModelClass(obj);
        }
    }
    return result;
};

/**
* Set the defaults for model input data
* @method defaults
* @param {object} obj with initial values
* @param {object} defaults values
* @return {object} object for model set with its own and default values 
*/
tools.defaults = function (obj, defaults) {
    obj = obj || {};
    defaults = defaults || {};
    for (var key in defaults) {
        if (defaults.hasOwnProperty(key)) {
            obj[key] = obj[key] === undefined ? defaults[key] : obj[key];
        }
    }
    return obj;
};

/**
* Adds readonly, not enumerable property "res" (it does not get stringified!)
* @method resources
* @param {string} node resource entry point
* @param {string} section (if not specified loads the whole node of resources)
* @param {string} language (default is "en")
* @return {object} property content added to context
*/
tools.resources = function (node, section, language) {
    language = language || 'en';
    var value = RESOURCES[language][node];
    if (typeof section === 'string') {
        value = value[section];
    }
    return value;
};

/**
* Creates an array of select options
*
* @method options
* @param {object/array} options key-value hash table or array of object: { value: 'xxx', text: 'Something' }
* @param {string} selected item
* @return {array} array of options in format: { value: 'xxx', text: 'Something', selected: ' selected' }
*/
tools.options = function (options, selected) {
    var result = [],
    item;
    // Check for array vs object
    if (Array.isArray(options)) {
        for (var i = 0, len = options.length; i < len; i++) {
            item = options[i];
            if (selected === item.value) {
                item.selected = ' selected';
            }
            result.push(item);
        }
    } else {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                item = { value: key, text: options[key] };
                if (selected === item.value) {
                    item.selected = ' selected';
                }
                result.push(item);
            }
        }
    }
    return result;
};

/**
* Adds new callback to event list but checking if the event already on the list avoiding double subscription
*
* @method addToEvents
* @param {array} handlers array
* @param {function} callback method pointer
* @return {boolean} True if event added to the list
*/
tools.addToEvents = function (handlers, callback) {
    var result = false;
    if (Array.isArray(handlers) && callback && handlers.indexOf(callback) === -1) {
        handlers.push(callback);
        result = true;
    }
    return result;
};

/**
* Runs events stored in an array and pass native event and custom arguments to callback function
*
* @method callEvents
* @param {object} obj hosting
* @param {array} handlers Array of events
* @param {object} event object passed by the control
* @param {object} args custom arguments
* @return {undefined}
*/
tools.callEvents = function (obj, handlers, event, args) {
    // Run events
    for (var i = 0, len = handlers.length; i < len; i++) {
        if (typeof handlers[i] === 'function') {
            if (event === undefined || event === null) {
                handlers[i].call(obj, args);
            } else {
                handlers[i].call(obj, event, args);
            }
        }
    }
};

/**
* Creates date from ISO string and compensates for time zone difference
*
* @method ISOStringToDate
* @param {string} value (ISO 8601 format: "yyyy-MM-ddThh:mm:ss:tttZ")
* @return {Date} standard Date
*/
tools.ISOStringToDate = function (value) {
    var result = value;
    // Convert
    if (typeof value === 'string') {
        result = new Date(value);
        // Correct for timezone difference
        result.setMinutes(result.getMinutes() + result.getTimezoneOffset());
    }
    return result;
};

/**
* Converts date to ISO string and compensates for time zone difference
*
* @method DateToISOString
* @param {Date} value standard Date
* @return {string} value (ISO 8601 format: "yyyy-MM-ddThh:mm:ss:tttZ")
*/
tools.DateToISOString = function (value) {
    var result = value;
    // Convert
    if (value instanceof Date) {
        // Correct for timezone difference
        value.setMinutes(value.getMinutes() - result.getTimezoneOffset());
        result = value.toISOString();
    }
    return result;
};

/**
* Abbreviates large numbers to short thousands/million format 10k.. 1.2M etc.
*
* @method shortNumber
* @param {number} value - number to shorten
* @return {string} short version of number
*/
tools.shortNumber = function (value) { /* Formats large numbers to Xk or XM format */
    value = value === undefined || value === null || value === '' ? 0 : value;
    var result = value.toString(), // coerce to string
    mode = "";
    value = parseInt(value, 10);
    // Calculate abbreviation
    if (value >= 1000 && value < 1000000) {
        value = Math.floor(value / 1000);
        if (value < 1000) {
            mode = "k";
        } else {
            value = Math.floor(value / 1000);
            mode = "M";
        }
    } else if (value >= 1000000) {
        value = Math.floor(value / 1000);
        value = Math.floor(value / 10);
        value = (value / 100).toFixed(2);
        mode = "M";
    }
    // Convert result
    result = value.toString();
    // Suppress last zero digits
    if (result.indexOf(".00") > -1) {
        result = result.substr(0, result.indexOf(".00"));
    }
    // Suppress last empty digit (zero)
    if (result.indexOf('.') > -1 && result.substr(result.length-1, 1) === "0") {
        result = result.substr(0, result.length-1);
    }
    result += mode;
    return result;
};

/**
* Adds thousands separator
*
* @method formatNumber
* @param {number} value number to format
* @return {string} number converted to string containing the thousand separator characaters
*/
tools.formatNumber = function (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
* Formatting phone number to standard
*
* @method formatPhone
* @param {string} raw phone value
* @return {string} standard formatted value
*/
tools.formatPhone = function (raw) {
    raw = raw === undefined ? '' : raw;
    var regexObj = /^(?:\+?1[\-. ]?)?(?:\(?([0-9]{3})\)?[\-. ]?)?([0-9]{3})[\-. ]?([0-9]{4})$/;
    if (regexObj.test(raw)) {
        var parts = raw.match(regexObj);
        var phone = "";
        if (parts[1]) {
            phone += "(" + parts[1] + ") ";
        }
        phone += parts[2] + "-" + parts[3];
        return phone;
    } else {
        //invalid phone number
        return raw;
    }
};

/**
* Validates phone number
*
* @method validPhone
* @param {string} value raw phone number
* @return {boolean} true if phone number is valid
*/
tools.validPhone = function (value) {
    var regexObj = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    return regexObj.test(value);
};

/**
* Validates email
*
* @method validEmail
* @param {string} value email address
* @return {boolean} true if email is valid
*/
tools.validEmail = function (value) {
    var regexObj = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexObj.test(value);
};

/**
* Validates url
*
* @method validUrl
* @param {string} value of url
* @return {boolean} true if url is valid
*/
tools.validUrl = function (value) {
    var regexObj = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;
    return regexObj.test(value);
};

/**
* Replaces all occurences in a string
*
* @method replaceAll
* @param {string} str to be manipulated
* @param {string} find - content to be replaced
* @param {string} replace - replacement string
* @return {string} the value trimmed in the end
*/
tools.replaceAll = function (str, find, replace) {
    if (str) {
        str = str.replace(new RegExp(find, 'g'), replace);
    }
    return str;
};

/**
* Combines first and last name
*
* @method fullName
* @param {string} firstName of the person
* @param {string} lastName of the person
* @param {string} empty - default is "na"
* @return {string} full name
*/
tools.fullName = function (firstName, lastName, empty) {
    var result = '';
    if (typeof firstName === 'string') {
        result += firstName.trim();
    }
    if (typeof lastName === 'string') {
        result += (' ' + lastName);
    }
    result = result.trim();
    if (result === '') {
        result = empty || 'na';
    }
    return result;
};

/**
* Provides initals for a name
*
* @method initials
* @param {string} firstName of the person
* @param {string} lastName of the person
* @param {string} empty - default is "??"
* @return {string} initials of the name
*/
tools.initials = function (firstName, lastName, empty) {
    var result = '';
    if (typeof firstName === 'string' && firstName.length > 0) {
        result += firstName.trim().substr(0, 1).toUpperCase();
    }
    if (typeof lastName === 'string' && lastName.length > 0) {
        result += lastName.trim().substr(0, 1).toUpperCase();
    }
    if (result === '') {
        result = empty || '??';
    }
    return result;
};

if (isNode) {
    module.exports = tools;
} else {
    window.hiso = window.hiso || {};
    window.hiso.tools = tools;
}