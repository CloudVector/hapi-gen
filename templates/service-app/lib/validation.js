"use strict";
/**
* Generic validations used multiple widgets
**/
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const schemas = {};

schemas.client = joi.string().required().description('Client ID');
schemas.debug = joi.boolean().optional().default(false).description('Debug flag');
schemas.id = joi.objectId().required().description('Mongodb ObjectId');

module.exports = schemas;