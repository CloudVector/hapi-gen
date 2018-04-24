'use strict';

const internals = {};

internals.hasValue = (list, value) => {
    return (Array.isArray(list) && list.length > 0 && list.indexOf(value) > -1);
};

/* Replace all occurences */
internals.replaceAll = (str, search, replacement) => {
    return str.replace(new RegExp(search, 'g'), replacement);
};

/* Converts to camelcase */
internals.toCamelCase = (str) => {
    str = internals.replaceAll(str, '-', ' ');
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) {
            return "";
        } // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

/* Converts to title case */
internals.toTitleCase = (str) => {
    str = internals.toCamelCase(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
};

class Model {
    constructor(model) {
        Object.assign(this, model);
    }

    nameAsVariable() {
        return internals.toCamelCase(this.name);
    }

    nameAsClass() {
        return internals.toTitleCase(this.name);
    }

    hasDb () {
        return (this.database !== 'none');
    }

    hasMongo () {
        return (this.database === 'mongodb');
    }

    hasMySql () {
        return (this.database === 'mysql');
    }

    hasElasticSearch() {
        return (this.database === 'elasticsearch');
    }

    hasGet() {
        return internals.hasValue(this.endpoint, 'GET');
    }

    hasPost() {
        return internals.hasValue(this.endpoint, 'POST');
    }

    hasPut() {
        return internals.hasValue(this.endpoint, 'PUT');
    }

    hasDelete() {
        return internals.hasValue(this.endpoint, 'DELETE');
    }

    hasEngineDust() {
        return internals.hasValue(this.viewengine, 'dust');
    }

    endpoint() {
        let result = [];
        result.push('/');
        if (this.useapi === true) {
            result.push('api');
        }
        if (this.version && Array.isArray(this.useversion) && this.useversion.length > 0) {
            let v = this.version.split('.');
            let major = v[0];
            let minor = v[1];
            let patch = v[2];
            let ver = '';
            // Add version elements
            if (internals.hasValue(this.useversion, 'major')) {
                ver += major
            }
            if (internals.hasValue(this.useversion, 'minor')) {
                if (!ver.endsWith('.')) {
                    ver += '.';
                }
                ver += minor;
            }
            if (internals.hasValue(this.useversion, 'patch')) {
                if (!ver.endsWith('.')) {
                    ver += '.';
                }
                ver += patch;
            }
            // Add slash, if missing
            if (result[result.length-1] !== '/') {
                result.push('/');
            }
            result.push(ver);
        }
        // Add slash, if missing
        if (result[result.length-1] !== '/') {
            result.push('/');
        }
        return result.join('');
    }
}

module.exports = Model;