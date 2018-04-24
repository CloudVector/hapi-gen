'use strict';

const files = require('./files.js');
const WIDGET_FOLDER = 'widgets';

module.exports = (plugins, filename) => {
    let list = files.directories([__dirname, '..', WIDGET_FOLDER].join('/'));
    /* Register ALL widgets */
    //console.log('Loading plugins...');
    list.forEach((folder) => {
        let file = ['../', WIDGET_FOLDER, '/', folder, '/', filename, '.js'].join('');
        try {
            var plugin = require(file);
            plugins.push(plugin);
            //console.log('  ' + folder.toUpperCase());
        }
        catch (e) {
            console.error(e);
        }
    });
    return plugins;
};