'use strict';

const path = require('path');
const fs = require('fs');
const internals = {};

/* Load directories */
internals.directories = (dir) => {
    let result = [];
    try {
        result = fs.readdirSync(dir).filter((file) => {
            let fullPath = path.join(dir, file);
            return fs.statSync(fullPath).isDirectory();
        });
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    return result;
};

/* Load files from directory */
internals.files = (dir, extension) => {
    let result = [];
    try {
        result = fs.readdirSync(dir).filter((file) => {
            let fullPath = path.join(dir, file);
            let isFile = fs.statSync(fullPath).isFile();
            let isExt = true;
            if (extension) {
                isExt = (path.extname(file).toLowerCase() === extension.toLowerCase());
            }
            return (isFile && isExt);
        });
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    return result;
};

/* Copy a file or a full directory */
internals.copy = (src, dest) => {
    // Check if both is directory
    if (internals.isDir(src) && internals.isDir(dest)) {
        let files = internals.files(src);
        files.forEach(async (file) => {
            let srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            fs.copyFileSync(srcFile, destFile);
        });
        let dirs = internals.directories(src);
        dirs.forEach((dir) => {
            let srcDir = path.join(src, dir);
            let destDir = path.join(dest, dir);
            internals.createDir(destDir);
            internals.copy(srcDir, destDir);
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

/* Read a file */
internals.read = (file, options) => {
    options = options || { encoding: 'utf8' };
    return fs.readFileSync(file, options);
};

/* Rename a file */
internals.rename = (oldPath, newPath) => {
    fs.renameSync(oldPath, newPath);
};

/* Remove a file or directory */
internals.remove = (file) => {
    if (fs.statSync(file).isDirectory()) {
        // Check content
        let list = fs.readdirSync(file);
        list.forEach((item) => {
            let fullName = path.join(file, item);
            if (fs.statSync(fullName).isDirectory()) {
                internals.remove(fullName);
            } else {
                fs.unlinkSync(fullName);
            } 
        });
        // Remove directory
        fs.rmdirSync(file);
    } else {
        // Remove file
        fs.unlinkSync(file);
    }
};

/* write a file */
internals.write = (file, content, options) => {
    options = options || { encoding: 'utf8' };
    fs.writeFileSync(file, content, options);
};

/* Creates a directory */
internals.createDir = (dir) => {
    try {
        fs.mkdirSync(dir);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
};

/* Create a single file */
internals.createFile = (file, content) => {
    fs.appendFileSync(file, content);
};

/* Checks if file is not a directory entry */
internals.isDir = (file) => {
    return fs.statSync(file).isDirectory();
};

/* Checks if file exists */
internals.exists = (file) => {
    let result = false;
    try {
        result = fs.statSync(file).isFile();
    } catch (err) {
        if (err.code != 'ENOENT') {
            throw err;
        }
    }
    return result;
};

/* Replace all occurences */
internals.replaceAll = (str, search, replacement) => {
    return str.replace(new RegExp(search, 'g'), replacement);
};

/* Converts to camelcase */
internals.toCamelCase = (str) => {
    str = internals.replaceAll(str, '-', ' ');
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) {
            return "";
        } // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

/* Converts to title case */
internals.toTitleCase = (str) => {
    str = internals.toCamelCase(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
};


module.exports = {
    // Gets the directory names for single level (not recursive!)
    directories: internals.directories,
    // Gets the file names for single level or type if extension is specified
    files: internals.files,
    // Read the file content
    read: internals.read,
    // Write content to file
    write: internals.write,
    // Remove a single file or directory
    remove: internals.remove,
    // Rename a single file or directory
    rename: internals.rename,
    // Copy a single file or directory
    copy: internals.copy,
    // Create directory
    createDir: internals.createDir,
    // Create file
    createFile: internals.createFile,
    // Checks if entry is file and not directory
    isDir: internals.isDir,
    // Check file existence
    exists: internals.exists,
    // Convert to TitleCase
    toTitleCase: internals.toTitleCase,
    // Convert to CamelCase
    toCamelCase: internals.toCamelCase,
    // Replace all in string
    replaceAll: internals.replaceAll
};