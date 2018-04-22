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

// Onload event for Dust to dynamically load views
dust.config.whitespace = true;
dust.onLoad = internals.dustLoad;

/* Event called in copy */
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

/* Call an event while reading and writing a file */
internals.copyWithEvent = (src, dest, event, options) => {
    let data = {
        src: src,
        dest: dest,
        content: files.read(src, options)
    };
    let temp = event(data);
    if (typeof temp.then === 'function') {
        temp.then((d) => {
            files.write(d.dest, d.content);
        });
    } else {
        files.write(temp.dest, temp.content);
    }
};

/* Copy a file or a full directory */
internals.copyContent = (src, dest, event, options) => {
    // Check if both is directory
    if (files.isDir(src) && files.isDir(dest)) {
        let list = files.files(src);
        list.forEach((file) => {
            let srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            if (file.endsWith('.dust')) {
                internals.copyWithEvent(srcFile, destFile, event, options);
            } else if (!files.exists(srcFile + '.dust')) {
                fs.copyFileSync(srcFile, destFile);
            }
        });
    } else {
        if (src.endsWith('.dust')) {
            files.copyWithEvent(src, dest, event);
        } else if (!files.exists(src + '.dust')) {
            fs.copyFileSync(src, dest);
        }
    }
};

// Create subfolder and copies over everything
internals.copyTemplate = (src, dest, model) => {
    _model = model;
    let dirs = files.directories(src);
    dirs.forEach((dir) => {
        let srcSub = path.join(src, dir);
        let destSub = path.join(dest, dir);
        files.createDir(destSub);
        internals.copyTemplate(srcSub, destSub, model);
    });
    internals.copyContent(src, dest, internals.onCopy);
};

module.exports = internals.copyTemplate;