"use strict";
const joi = require('joi');
const phone = require('joi-phone');
joi.objectId = require('joi-objectid')(joi);

/**
* JOI Object Id - mongodb standard
*
* @method id
* @return {object} JOI validation object for Mongodb ObjectId
*/
joi.id = () => {
    return joi.objectId().description('MongoDb Object Id');
};

/**
* JOI GeoJSON validation for point
*
* @method geoPoint
* @return {object} JOI validation object for a GeoJSON point
*/
joi.geoPoint = () => {
    return joi.object().keys({
        type: joi.valid('Point'),
        coordinates: joi.array().items(joi.number()).length(2)
    }).and('type', 'coordinates');
};

/**
* JOI GeoJSON validation for polygon or multipolygon
*
* @method geoPolygon
* @return {object} JOI validation object for a GeoJSON polygon or multipolygon
*/
joi.geoPolygon = () => {
    return joi.object().keys({
        type: joi.valid('Polygon', 'MultiPolygon'),
        coordinates: joi.array().items(joi.array())
    }).and('type', 'coordinates');
};

/**
* JOI postal code validation (USA + Canada + EU + Asia)
*
* @method postalCode
* @return {object} JOI validation object for postal code
*/
joi.postalCode = () => {
    return joi.alternatives().try([
        joi.string().regex(/^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/, 'USA').required(),
        joi.string().regex(/^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/, 'Canada').required(),
        joi.string().regex(/^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/, 'Other').required()
    ]);
};

/**
* JOI phone number, using E164 standard
*
* @method phone
* @return {object} JOI validation object for phone
*/
joi.phone = () => {
    return phone.e164().description('Phone number').label('Invalid phone format detected. Expected: E164 standard!');
};

/**
* JOI client id
*
* @method clientId
* @return {object} JOI client id
*/
joi.clientId = () => {
    return joi.string().required().description('Client ID');
};

/**
* JOI debug flag 
*
* @method debug
* @return {object} JOI debug flag
*/
joi.debug = () => {
    return joi.boolean().optional().description('Debug flag');
};

module.exports = joi;