'use strict';

const internals = {};

internals.hasValue = (list, value) => {
    return (Array.isArray(list) && list.length > 0 && list.indexOf(value) > -1);
};

class Model {
    constructor(model) {
        Object.assign(this, model);
    }

    hasMongo () {
        return (this.db === 'mongodb');
    }

    hasMySql () {
        return (this.db === 'mysql');
    }

    hasElasticSearch() {
        return this.db === 'elasticsearch'
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
}

module.exports = Model;