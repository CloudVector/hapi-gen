'use strict';

const path = require('path');
const files = require('./files.js');
const copyTemplate = require('./copy-template.js');

// Generate content
module.exports = (model, templatePath, currentPath) => {
    // Assign variables to make it global for the file
    let src = path.join(templatePath, model.type);
    if (model.type.endsWith('-app')) {
        // Check if project folder exists or not
        let dest = currentPath;
        // Check if we are not in already the folder
        if (!currentPath.endsWith(model.name)) {
            files.createDir(`${currentPath}/${model.name}`);
            dest = path.join(currentPath, model.name);
        }
        // copy content
        copyTemplate(src, dest, model);
        console.log(`Generation of ${model.type} project: "${model.name}" completed`);
    } else {
        let dest;
        if (model.type === 'service-plugin') {
            dest = path.join(currentPath, 'plugins', model.name);
        } else if (model.type === 'web-app-widget') {
            dest = path.join(currentPath, 'widgets', model.name);
        }
        files.createDir(dest);
        copyTemplate(src, dest, model);
        console.log(`Generation of ${model.type} component: "${model.name}" completed`);
    }
};