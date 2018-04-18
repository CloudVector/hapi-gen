"use strict";

const fs = require('fs');
const path = require('path');

module.exports = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                let result = data.filter((file) => {
                    return fs.statSync(path.join(filePath, file)).isDirectory();
                });
                resolve(result);
            }
        });
    });
};