'use strict';

class Model {
    constructor(model) {
        Object.assign(this, model);
    }

    hasDb () {
        return (this.db !== undefined && this.db !== 'none');
    }

    isMongo() {
        return (this.db === 'mongodb');
    }

    isMySql() {
        return (this.db === 'mysql');
    }

    isElasticSearch() {
        return (this.db === 'elasticsearch');
    }
}

module.exports = Model;