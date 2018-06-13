'use strict';

const path = require('path');
const fs = require('fs');
const files = require('./files.js');
const dust = require('dustjs-linkedin');
const internals = {};
let _model = null;

/* Load event intercept */
internals.dustLoad = (templateName, callback) => {
    try {
        let content = files.read(templateName);
        callback(null, content);
    } catch (err) {
        callback(err, null);
    }
};

/* Substitute macro file name with real name */
internals.replaceName = (fileName) => {
    if (fileName.indexOf('{name}') > -1) {
        fileName = fileName.replace('{name}', _model.name);
    }
    return fileName;
};

// Onload event for Dust to dynamically load views
dust.config.whitespace = true;
dust.onLoad = internals.dustLoad;

/* Event called in copy */
internals.onCopy = (options) => {
    return new Promise((resolve, reject) => {
        // Check if its a template, if yes we need to render it
        if (internals.isTemplate(options.src)) {
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

/* Call an event while reading and writing a file */
internals.copyWithEvent = (src, dest, event, options) => {
    let data = {
        src: src,
        dest: dest,
        content: files.read(src, options)
    };
    // Call event
    event(data).then((res) => {
        files.write(res.dest, res.content);
    });
};

/* Check if a file is not allowed to be copied */
internals.allowToCopy = (file) => {
    let result = true;
    let name = path.basename(file);
    if (files.exists(file + '.dust')) {
        result = false;
    } else if (name === 'package-lock.json') {
        result = false;
    } else if (_model.dbNotUsed.indexOf(name) > -1) {
        result = false;
    }
    return result;
};

/* Check if its a template file */
internals.isTemplate = (file) => {
    return (file.endsWith('.js.dust') ||
            file.endsWith('.json.dust') ||
            file.endsWith('.dust.dust'));
};

/* Copy a file or a full directory */
internals.copyContent = (src, dest, event, options) => {
    // Check if both is directory
    if (files.isDir(src) && files.isDir(dest)) {
        let list = files.files(src);
        list.forEach((file) => {
            let srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            // Check if file name contains a template macro
            destFile = internals.replaceName(destFile); 
            // Check if its a template file we need to process

            if (internals.isTemplate(file)) {
                destFile = destFile.substring(0, destFile.length-5); // Remove .dust extension to get back original file name

                if (srcFile.indexOf('search-page.dust.dust') > -1) {
                    console.log('SOURCE: ', srcFile);
                    console.log('TARGET: ',  destFile);
                }

                internals.copyWithEvent(srcFile, destFile, event, options);
            } else if (internals.allowToCopy(srcFile)) {
                // Simple copy
                fs.copyFileSync(srcFile, destFile);
            }
        });
    } else if (internals.allowToCopy(src)) {
        fs.copyFileSync(src, dest);
    }
};

// Create subfolder and copies over everything
internals.copyTemplate = (src, dest, model) => {
    _model = model;
    let dirs = files.directories(src);
    dirs.forEach((dir) => {
        if (dir !== 'node_modules') {
            let srcSub = path.join(src, dir);
            let destSub = path.join(dest, dir);
            files.createDir(destSub);
            internals.copyTemplate(srcSub, destSub, model);
        }
    });
    internals.copyContent(src, dest, internals.onCopy);
};

module.exports = internals.copyTemplate;