'use strict';

const files = require('./files.js');
const internals = {};

internals.hasValue = (list, value) => {
    return (Array.isArray(list) && list.length > 0 && list.indexOf(value) > -1);
};

class Model {
    constructor(model) {
        Object.assign(this, model);
    }

    nameAsVariable() {
        return files.toCamelCase(this.name);
    }

    nameAsClass() {
        return files.toTitleCase(this.name);
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
        // Add word API
        if (this.useapi === true) {
            result.push('api');
            result.push('/');
        }
        // Add Version
        if (this.version && Array.isArray(this.useversion) && this.useversion.length > 0) {
            let v = this.version.split('.');
            let major = v[0];
            let minor = v[1];
            let patch = v[2];
            let ver = 'v';
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
        // Add name
        result.push(this.name);
        return result.join('');
    }
}

module.exports = Model;