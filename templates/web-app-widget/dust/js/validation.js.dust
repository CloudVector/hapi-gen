"use strict";

const joi = require('joi');
const JoiExt = require('../../../lib/joi-ext.js');
const joiExt = new JoiExt();
const schemas = {};

schemas.client = joi.string().required().description('Client ID');
schemas.debug = joi.boolean().optional().default(false, 'Debug flag');
schemas.id = joi.string().regex(/[A-Za-z0-9\-]+/);
schemas.search = {
    search: joi.string().regex(/[a-zA-Z\d\-]/).empty(''),
    page: joi.number().integer().min(1).default(1),
    size: joi.number().integer().min(1).max(100).default(10),
    sort: joi.string().valid(['name-az', 'name-za']).default('name-az')
};

schemas.upsert = {
    id: schemas.id.optional(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    image: joi.string(),
    title: joi.string(),
    maritalStatus: joi.string(),
    email: joi.string().email(),
    phone: joiExt.phone(),
    company: joi.string(),
    department: joi.string(),
    income: joi.number().positive(),
    ssn: joi.string().regex(/^[0-9]+$/, 'numbers'),
    country: joi.string(),
    region: joi.string(),
    postalCode: joiExt.postalCode(),
    city: joi.string(),
    address: joi.string(),
    lat: joi.number(),
    lng: joi.number(),
    note: joi.string()
};

module.exports = schemas;