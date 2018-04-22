'use strict';

const path = require('path');
const files = require('./files.js');
const copyTemplate = require('./copy-template.js');

// Generate content
module.exports = (model, templatePath, currentPath) => {
    // Assign variables to make it global for the file
    // Check if project folder exists or not
    let src = path.join(templatePath, model.type);
    let dest = currentPath;
    // Check if we are not in already the folder
    if (!currentPath.endsWith(model.name)) {
        files.createDir(`${currentPath}/${model.name}`);
        dest = path.join(currentPath, model.name);
    }
    // copy content
    copyTemplate(src, dest, model);
    console.log(`Generation of ${model.type} project: "${model.name}" completed`);
};