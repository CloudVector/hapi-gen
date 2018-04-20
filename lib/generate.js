'use strict';

const dust = require('dustjs-linkedin');
const path = require('path');
const files = require('./files.js');
const internals = {};
let _model = null;

internals.dustLoad = (templateName, callback) => {
    try {
        let content = files.read(templateName);
        callback(null, content);
    } catch (err) {
        callback(err, null);
    }
};

// Event called in copy 
internals.onCopy = (options) => {
    return new Promise((resolve, reject) => {
        // Check if its a template, if yes we need to render it
        if (options.src.indexOf('.dust') > -1) {
            options.dest = options.dest.replace('.dust', '');
            dust.render(options.src, _model, (err, out) => {
                if (err) {
                    reject(err);
                } else {
                    options.content = out;
                    resolve(options);
                }
            });
        } else {
            resolve(options);
        }
    });
};

// Create subfolder and copies over everything
internals.copyTemplate = (src, dest) => {
    let dirs = files.directories(src);
    dirs.forEach((dir) => {
        let srcSub = path.join(src, dir);
        let destSub = path.join(dest, dir);
        files.createDir(destSub);
        internals.copyTemplate(srcSub, destSub);
    });
    files.copy(src, dest, internals.onCopy);
};

// Onload event for Dust to dynamically load views
dust.config.whitespace = true;
dust.onLoad = internals.dustLoad;

// Generate content
module.exports = (model, templatePath, currentPath) => {
    // Assign variables to make it global for the file
    _model = model;
    // Check if project folder exists or not
    let src = path.join(templatePath, model.type);
    let dest = currentPath;
    // Check if we are not in already the folder
    if (!currentPath.endsWith(model.name)) {
        files.createDir(`${currentPath}/${model.name}`);
        dest = path.join(currentPath, model.name);
    }
    // copy content
    internals.copyTemplate(src, dest);
    console.log(`Generation of ${model.type} project: "${model.name}" completed`);
};