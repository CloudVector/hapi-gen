"use strict";

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = require('chai').expect;
const mocks = require('./mocks.json');
const SearchItemModel = require('../js/searchItemModel.js');
const SearchModel = require('../js/searchModel.js');

lab.experiment('Single search item', () => {
    
    let model = new SearchItemModel(mocks.person);

    lab.test('properties', () => {
        // Check expectations
        expect(model).to.have.property('firstName');
        expect(model).to.have.property('lastName');
        expect(model.firstName).to.equal('Thomas');
        expect(model.lastName).to.equal('Conner');
    });

    lab.test('methods', () => {
        expect(model.fullName()).to.equal('Thomas Conner');
        expect(model.initials()).to.equal('TC');
        expect(model.address()).to.equal('P.O. Box 927, 6986 Sollicitudin St., Louisville KY 37924 - Guam');
        expect(model.comment()).to.equal('N/A');
    });
});

lab.experiment('Search model', () => {

    let model = new SearchModel(mocks.search);

    lab.test('pagination', () => {
        expect(model).to.have.property('pagination');
        expect(model.pagination).to.be.an('object');
        expect(model.pagination.size).to.equal(2);
        expect(model.pagination.sort).to.equal('name-az');
    });

    lab.test('items', () => {
        expect(model).to.have.property('items');
        expect(model.items).to.be.an('array');
        expect(model.items[0]).to.be.an.instanceOf(SearchItemModel);
    });
});
