'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schemas = {};

schemas.type = {
    type: Joi.string().valid(['alpha', 'beta', 'gamma']).required()
}

schemas.save = {
    alpha: Joi.string().optional(),
    beta: Joi.string().optional(),
    delta: Joi.number().optional(),
    gamma: Joi.string().optional(),
    start: Joi.date().optional(),
    end: Joi.date().optional()
};

// List for query
schemas.list = {
    name: Joi.string(),
    tag: Joi.string(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(5).max(25).default(10),
    sort: Joi.string().valid(['name', 'tag']).default('name')
};

// ID compatible with MongoDB ObjectID
schemas.id = {
    id: Joi.objectId().required()
}

module.exports = schemas;
