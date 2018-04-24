"use strict";
const joi = require('joi');

class JoiExt {

    constructor (states) {
        this._stateCodes = null;
        this._stateNames = null;
        if (states) {
            this._states = states;
        } else {
            this._states = {
                AL: "Alabama",
                AK: "Alaska",
                AZ: "Arizona",
                AR: "Arkansas",
                CA: "California",
                CO: "Colorado",
                CT: "Connecticut",
                DE: "Delaware",
                DC: "District Of Columbia",
                FL: "Florida",
                GA: "Georgia",
                HI: "Hawaii",
                ID: "Idaho",
                IL: "Illinois",
                IN: "Indiana",
                IA: "Iowa",
                KS: "Kansas",
                KY: "Kentucky",
                LA: "Louisiana",
                ME: "Maine",
                MD: "Maryland",
                MA: "Massachusetts",
                MI: "Michigan",
                MN: "Minnesota",
                MS: "Mississippi",
                MO: "Missouri",
                MT: "Montana",
                NE: "Nebraska",
                NV: "Nevada",
                NH: "New Hampshire",
                NJ: "New Jersey",
                NM: "New Mexico",
                NY: "New York",
                NC: "North Carolina",
                ND: "North Dakota",
                OH: "Ohio",
                OK: "Oklahoma",
                OR: "Oregon",
                PA: "Pennsylvania",
                RI: "Rhode Island",
                SC: "South Carolina",
                SD: "South Dakota",
                TN: "Tennessee",
                TX: "Texas",
                UT: "Utah",
                VT: "Vermont",
                VA: "Virginia",
                WA: "Washington",
                WV: "West Virginia",
                WI: "Wisconsin",
                WY: "Wyoming"
            };
        }
    }

    /**
    * List of USA states
    *
    * @method statesUSA
    * @return {object} list of state codes and names for United States 
    */
    statesUSA () {
        return this._states;
    }

    /**
    * List of USA state codes
    *
    * @method stateCodesUSA
    * @return {array} list of state codes for United States 
    */
    stateCodesUSA () {
        if (this._stateCodes === null) {
            this._stateCodes = Object.keys(this._states);
        }
        return this._stateCodes;
    }

    /**
    * List of USA state names
    *
    * @method stateNamesUSA
    * @return {array} list of state names for United States 
    */
    stateNamesUSA () {
        if (this._stateNames === null) {
            this._stateNames = Object.values(this._states);
        }
        return this._stateNames;
    }

    /**
    * JOI GeoJSON validation for point
    *
    * @method geoPoint
    * @return {object} JOI validation object for a GeoJSON point
    */
    geoPoint () {
        return joi.object().keys({
            type: joi.valid('Point'),
            coordinates: joi.array().items(joi.number()).length(2)
        }).and('type', 'coordinates');
    }

    /**
    * JOI GeoJSON validation for polygon or multipolygon
    *
    * @method geoPolygon
    * @return {object} JOI validation object for a GeoJSON polygon or multipolygon
    */
    geoPolygon () {
        return joi.object().keys({
            type: joi.valid('Polygon', 'MultiPolygon'),
            coordinates: joi.array().items(joi.array())
        }).and('type', 'coordinates');
    }

    /**
    * JOI single condition value
    *
    * @method conditionValue
    * @return {object} JOI validation object for a single value condition
    */
    conditionValue (validItems) {
        if (validItems && validItems.length && validItems.length > 0) {
            return joi.object().keys({ 
                value: joi.string().required().valid(validItems)
            });
        } else {
            return joi.object().keys({ 
                value: joi.string().required()
            });
        }
    }

    /**
    * JOI single condition range
    *
    * @method conditionRange
    * @return {object} JOI validation object for a single range condition
    */
    conditionRange () {
        return joi.object().keys({
            from: joi.string().required(),
            to: joi.string().required()
        }).and('from', 'to');
    }

    /**
    * JOI single condition list
    *
    * @method conditionList
    * @return {object} JOI validation object for a single list condition
    */
    conditionList (validItems) {
        if (validItems && validItems.length && validItems.length > 0) {
            return joi.object().keys({
                list: joi.array().items(joi.string().valid(validItems)).min(1),
                operator: joi.valid('and', 'or')
            });
        } else {
            return joi.object().keys({
                list: joi.array().items(joi.string()).min(1),
                operator: joi.valid('and', 'or')
            });
        }
    }

    /**
    * JOI single condition radius
    *
    * @method conditionRadius
    * @return {object} JOI validation object for a single radius condition
    */
    conditionRadius () {
        return joi.object().keys({
            center: self.geoPoint(),
            radius: joi.number()
        });
    }

    /**
    * JOI single condition GEO
    *
    * @method conditionGeo
    * @return {object} JOI validation object for a single GEO condition
    */
    conditionGeo () {
        return joi.alternatives().try([
            // Standar top left / bottom right rectangle spec
            joi.object().keys({
                topLeft: self.geoPoint(),
                bottomRight: self.geoPoint()
            }).and('topLeft', 'bottomRight'),
            // Google preferred south west / north east (min-max) rectangle spec
            joi.object().keys({
                southWest: self.geoPoint(),
                northEast: self.geoPoint()
            }).and('southWest', 'northEast'),
            // Any other polygon / multipolygon based Geo request
            joi.object().keys({
                boundary: self.geoPolygon()
            })
        ]);
    }

    /**
    * JOI single condition combined alternative for value or range
    *
    * @method conditionValueOrRange
    * @return {object} JOI validation object for an alternative for value or range
    */
    conditionValueOrRange (validItems) {
        return joi.alternatives().try(self.conditionValue(validItems), self.conditionRange());
    }

    /**
    * JOI single condition combined alternative for value or list
    *
    * @method conditionValueOrList
    * @return {object} JOI validation object for an alternative for value or list
    */
    conditionValueOrList (validItems) {
        return joi.alternatives().try(self.conditionValue(validItems), self.conditionList(validItems));
    }

    /**
    * JOI postal code validation (USA + Canada + Other)
    *
    * @method postalCode
    * @return {object} JOI validation object for postal code
    */
    postalCode () {
        return joi.alternatives().try([
            joi.string().regex(/^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/, 'USA').required(),
            joi.string().regex(/^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/, 'Canada').required(),
            joi.string().regex(/^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/, 'Other').required()
        ]);
    }

    /**
    * Validates phone number
    *
    * @method phone
    * @param {string} value raw phone number
    * @return {object} JOI validation object for US phone number
    */
    phone () {
        return joi.string().regex(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/);
    }
}

module.exports = JoiExt;