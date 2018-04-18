'use strict';

const dust = require('dustjs-linkedin');
const path = require('path');

dust.onLoad = function(templateName, [options], callback) {
  // `templateName` is the name of the template requested by dust.render / dust.stream
  // or via a partial include, like {> "hello-world" /}
  // `options` can be set as part of a Context. They will be explored later
  // `callback` is a Node-like callback that takes (err, data)
}

// Create subfolder and copies over everything
const copyData((options) => {

};

module.exports = async (answers, options) => {

    // Create project folder
    fs.mkdir(`${options.currentPath}/${answers.name}`, (err) => {
        if (err) {
            throw err;
        } else {

        }
    });
};