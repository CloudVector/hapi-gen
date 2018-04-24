"use strict";

const files = require('./files.js');

let list = files.directories(__dirname + '/../widgets');
let facade = {};

// Run for all widget look for repositories
//console.log('Registering repositories...');
list.forEach((folder) => {
    let repo = ['../widgets/', folder, '/js/repository.js'].join('');
    try {
        let Repository = require(repo);
        facade[folder] = new Repository();
        //console.log('Repository: ' + folder.toUpperCase());
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf('/repository.js') > -1) {
            console.log('skip: ' + folder.toUpperCase());
        } else {
            console.error(e);
        }
    }
});

module.exports = facade;