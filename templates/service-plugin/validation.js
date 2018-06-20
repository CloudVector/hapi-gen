'use strict';

const joi = require('joi');
const schemas = require('./../../lib/validation.js'); // Get generic validations from lib folder

// Create validation
schemas.add = {
    alpha: joi.string().optional(),
    beta: joi.string().optional(),
    delta: joi.number().optional(),
    gamma: joi.string().optional(),
    start: joi.date().optional(),
    end: joi.date().optional()
};

// Update validation
schemas.update = {
    alpha: joi.string().optional(),
    start: joi.date().optional(),
    end: joi.date().optional()
};

// List for query
schemas.list = {
    page: joi.number().min(1).default(1),
    size: joi.number().min(5).max(25).default(10),
    sort: joi.string().valid(['name', 'tag']).default('name'),
    client: schemas.client,
    debug: schemas.debug
};

module.exports = schemas;
