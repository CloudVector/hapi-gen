'use strict';

const dust = require('dustjs-linkedin');
const fs = require('fs');
const path = require('path');
const tools = require('@cloudvector/tools');
const internals = {};
let _model = null;

internals.dustLoad = async (templateName, callback) => {
    try {
        let content = await tools.read(templateName);
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
            let tmp = path.basename(options.src);
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
internals.copyTemplate = async (src, dest) => {
    let dirs = await tools.directories(src);
    dirs.forEach(async (dir) => {
        let srcSub = path.join(src, dir);
        let destSub = path.join(dest, dir);
        await tools.createDir(destSub);
        await internals.copyTemplate(srcSub, destSub);
    });
    await tools.copy(src, dest, internals.onCopy);
};

// Onload event for Dust to dynamically load views
dust.config.whitespace = true;
dust.onLoad = internals.dustLoad;

// Generate content
module.exports = async (model, templatePath, currentPath) => {
    // Assign variables to make it global for the file
    _model = model;
    // Create project folder
    await tools.createDir(`${currentPath}/${model.name}`);
    // copy content
    let src = path.join(templatePath, model.type);
    let dest = path.join(currentPath, model.name);
    await internals.copyTemplate(src, dest);
};