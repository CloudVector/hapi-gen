"use strict";

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = require('chai').expect;
const mocks = require('./mocks.json');
const PaginationModel = require('../js/paginationModel.js');

lab.experiment('Utilities', () => {
    let model = new PaginationModel();

    lab.test('isEmpty', () => {
        // Check expectations
        expect(model.isEmpty(undefined)).to.be.equal(true);
        expect(model.isEmpty(null)).to.be.equal(true);
        expect(model.isEmpty('')).to.be.equal(true);
        // valid numveric or boolean values are not empty!
        expect(model.isEmpty(0)).to.be.equal(false);
        expect(model.isEmpty(false)).to.be.equal(false);
    });
});

lab.experiment('Page count', () => {

    lab.test('getPageCount', () => {
        let model = new PaginationModel();
        expect(model.getPageCount(432, 20)).to.be.equal(22);
        expect(model.getPageCount(160, 20)).to.be.equal(8);
        expect(model.getPageCount(40, 20)).to.be.equal(2);
        expect(model.getPageCount(0, 20)).to.be.equal(0);
        expect(model.getPageCount(10, 0)).to.be.equal(0);
        expect(model.getPageCount(0, 0)).to.be.equal(0);
    });

    lab.test('Normal', () => {
        let model = new PaginationModel(mocks.normalPaging);
        // Check expectations
        expect(model.page).to.be.equal(1); 
        expect(model.size).to.be.equal(20);
        expect(model.count).to.be.equal(13);
    });

    lab.test('Large', () => {
        let model = new PaginationModel(mocks.largePaging);
        // Check expectations
        expect(model.page).to.be.equal(1); 
        expect(model.size).to.be.equal(50);
        expect(model.count).to.be.equal(179);
    });

    lab.test('Single', () => {
        let model = new PaginationModel(mocks.singlePaging);
        // Check expectations
        expect(model.page).to.be.equal(1); 
        expect(model.size).to.be.equal(20);
        expect(model.count).to.be.equal(1);
    });

    lab.test('Double', () => {
        let model = new PaginationModel(mocks.doublePaging);
        // Check expectations
        expect(model.page).to.be.equal(1); 
        expect(model.size).to.be.equal(20);
        expect(model.count).to.be.equal(2);
    });

});

lab.experiment('Navigation', () => {
    let model = new PaginationModel(mocks.normalPaging);
    lab.test('First', () => {
        // Check expectations
        model.next();
        expect(model.page).to.be.equal(2);

        model.last();
        expect(model.page).to.be.equal(13);

        model.prev();
        expect(model.page).to.be.equal(12);

        model.go(5);
        expect(model.page).to.be.equal(5);

        model.go(40); // Outside of range, stays on 5
        expect(model.page).to.be.equal(5);

        model.first();
        expect(model.page).to.be.equal(1);
    });
});
