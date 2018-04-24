'use strict';

const files = require('./files.js');
const path = require('path');
const WIDGETS_FOLDER = 'widgets';
let bundle = require('../bundle.json');

// Build Bundle configuration for all widgets
module.exports = () => {
    // Find all widgets
    let list = files.directories(path.join(__dirname, '../', WIDGETS_FOLDER));
    // Declare add to bundle method
    const addTobundle = (bnd, folder, type, mode, search) => {
        bundle[type] = bundle[type] || {};
        bundle[type][mode] = bundle[type][mode] || [];
        if (bnd[type] && Array.isArray(bnd[type][mode])) {
            bnd[type][mode].forEach(function (file) {
                bundle[type][mode].push(path.join(WIDGETS_FOLDER, folder, file));
            });
        } else if (search) {
            bundle[type][mode].push(path.join(WIDGETS_FOLDER, folder, search));
        }
    };
    // Update bundle with all the widgets
    list.forEach((folder) => {
        let bundleFile = path.join(__dirname, '..', WIDGETS_FOLDER, folder, 'bundle.json');
        try {
            const bnd = require(bundleFile);
            // Add to bundle
            addTobundle(bnd, folder, 'css', 'client', 'css/**/*.css');
            addTobundle(bnd, folder, 'js', 'client', 'js/**/*.js');
            addTobundle(bnd, folder, 'js', 'vendor', 'vendor/**/*.js');
            addTobundle(bnd, folder, 'view', 'client', 'view/**/*.dust');
            addTobundle(bnd, folder, 'view', 'server', 'view/**/*.dust');
            // Add tests
            bundle.test.push(path.join(WIDGETS_FOLDER, folder, 'test/**/*.js'));
        } catch (e) {
            console.log('Widget does not exists:', folder);
        }
    });

    // LOAD RESOURCES!
    // Prepare to load all languages for resources
    for (let lng in bundle.res) {
        if (bundle.res.hasOwnProperty(lng)) {
            let resFile = path.join(__dirname, '/../src/res', lng + '.json');
            bundle.res[lng] = require(resFile);
        }
    }

    // Collect all res file
    list.forEach((folder) => {
        for (let lng in bundle.res) {
            if (bundle.res.hasOwnProperty(lng)) {
                let resFile = path.join(__dirname, '/../', WIDGETS_FOLDER, folder, 'res', lng + '.json');
                try {
                    bundle.res[lng][folder] = require(resFile);
                } catch (e) {
                    console.log(['Resource does not exists: "', resFile].join(''));
                }
            }
        }
    });
    return bundle;
};