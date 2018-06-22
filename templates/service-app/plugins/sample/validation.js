'use strict';

const joi = require('./../../lib/joi-ext.js');
const schemas = {};

// Add scenario
schemas.addSample = {
    alpha: joi.string().optional(),
    beta: joi.string().optional(),
    delta: joi.number().optional(),
    gamma: joi.string().optional(),
    start: joi.date().optional(),
    end: joi.date().optional()
};

// For update scenario
schemas.updateSample = {
    alpha: joi.string().optional(),
    start: joi.date().optional(),
    end: joi.date().optional()
};

// List for query
schemas.listSample = {
    page: joi.number().min(1).default(1),
    size: joi.number().min(5).max(25).default(10),
    sort: joi.string().valid(['name', 'tag']).default('name')
};

schemas.typeSample = joi.string().valid(['alpha', 'beta', 'gamma']).default('alpha');

module.exports = schemas;
