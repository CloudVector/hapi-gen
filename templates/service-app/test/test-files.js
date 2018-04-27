'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = require('chai').expect;
const path = require('path');
const files = require('../lib/files.js');

const TEST_DIR = 'abc';
const TEST_FILE = 'file-';
const TEST_JSON = '{}';
const TEST_TEXT = 'ABC';
const SUB_DIRS = ['alpha', 'beta', 'gamma', 'delta'];

// Setup the environment
const runBefore = () => {
    files.createDir(path.join(__dirname, TEST_DIR));
    let count = 1;
    SUB_DIRS.forEach((dir) => {
        // Create folder
        files.createDir(path.join(__dirname, TEST_DIR, dir));
        // Create test files
        files.createFile(path.join(__dirname, TEST_DIR, dir, [TEST_FILE, count, '.json'].join('')), TEST_JSON);
        files.createFile(path.join(__dirname, TEST_DIR, dir, [TEST_FILE, count, '.txt'].join('')), TEST_TEXT);
        count++;
    });
};

const runAfter = () => {
    SUB_DIRS.forEach((dir) => {
        files.remove(path.join(__dirname, TEST_DIR, dir));
    });
    // Add omega folder
    files.remove(path.join(__dirname, TEST_DIR, 'omega'));
    // Remove sub directories
    // Remove main directory
    files.remove(path.join(__dirname, TEST_DIR));
};

// Build the test environment
lab.before(runBefore);

// Cleanup the test environment
lab.after(runAfter);


lab.experiment('list', () => {

    lab.test('directories', (flags) => {
        let sourcePath = path.join(__dirname, 'test');
        let list = files.directories(sourcePath);
        // Check expectations
        expect(list).to.be.an('array');
        flags.note(JSON.stringify(list, null, 4));
    });

    lab.test('all files', (flags) => {
        let sourcePath = path.join(__dirname, TEST_DIR, 'beta');
        let list = files.files(sourcePath);
        expect(list).to.be.an('array');
        flags.note(JSON.stringify(list, null, 4));
    });

    lab.test('json files', (flags) => {
        let sourcePath = path.join(__dirname, TEST_DIR, 'beta');
        let list = files.files(sourcePath, '.json');
        expect(list).to.be.an('array');
        flags.note(JSON.stringify(list, null, 4));
    });

});

lab.experiment('write-read', () => {
    lab.test('content', () => {
        let file = path.join(__dirname, TEST_DIR, 'readwrite.txt');
        files.createFile(file, 'HELLO WORLD');
        let content = files.read(file);
        expect(content).to.be.a('string');
        expect(content).to.be.equal('HELLO WORLD');
        files.remove(file);
    });
});

lab.experiment('copy', () => {
    lab.test('file', () => {
        let src = path.join(__dirname, TEST_DIR, 'alpha', 'apple.txt');
        let dest = path.join(__dirname, TEST_DIR, 'delta', 'apple.txt');
        files.createFile(src, 'DELICIOUS');
        files.copy(src, dest);
        let content = files.read(dest);
        expect(content).to.be.a('string');
        expect(content).to.be.equal('DELICIOUS');
        files.remove(src);
        files.remove(dest);
    });
});

lab.experiment('rename', () => {
    lab.test('file', () => {
        let src = path.join(__dirname, TEST_DIR, 'beta', 'apple.txt');
        let dest = path.join(__dirname, TEST_DIR, 'beta', 'orange.txt');
        files.createFile(src, 'DELICIOUS');
        files.rename(src, dest);
        let content = files.read(dest);
        expect(content).to.be.a('string');
        expect(content).to.be.equal('DELICIOUS');
        files.remove(dest);
    });

    lab.test('directory', () => {
        let src = path.join(__dirname, TEST_DIR, 'theta');
        let dest = path.join(__dirname, TEST_DIR, 'omega');
        files.createDir(src);
        files.createFile(path.join(src, 'something.txt'), 'SOMETHING');
        files.rename(src, dest);
        let content = files.read(path.join(dest, 'something.txt'));
        expect(content).to.be.a('string');
        expect(content).to.be.equal('SOMETHING');
    });
});

lab.experiment('remove', () => {
    lab.test('file', () => {
        let file = path.join(__dirname, TEST_DIR, 'gamma', 'apple.txt');
        files.createFile(file, 'DELICIOUS');
        let content = files.read(file);
        expect(content).to.be.a('string');
        expect(content).to.be.equal('DELICIOUS');
        files.remove(file);
        expect(files.exists(file)).to.be.equal(false);
    });
});
