'use strict';

const path = require('path');
const fs = require('fs');
const internals = {};

/* List directories or files */
internals.list = (dir, useFiles, extension) => {
    let result = [];
    try {
        result = fs.readdirSync(dir).filter((file) => {
            let fullPath = path.join(dir, file);
            let isDir = fs.statSync(fullPath).isDirectory();
            let isExt = true;
            if (extension) {
                isExt = (path.extname(file).toLowerCase() === extension.toLowerCase());
            }
            if (useFiles) {
                return (!isDir && isExt);
            } else {
                return isDir;
            }
        });
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    return result;
};

// Call an event while reading and writing a file
internals.copyWithEvent = (src, dest, event, options) => {
    let data = {
        src: src,
        dest: dest,
        content: internals.read(src, options)
    };
    let temp = event(data);
    if (typeof temp.then === 'function') {
        temp.then((d) => {
            internals.write(d.dest, d.content);
        });
    } else {
        internals.write(temp.dest, temp.content);
    }
};

/* Checks if file exists */
internals.exists = (file) => {
    let result = false;
    try {
        result = fs.statSync(fullPath(filePath, options)).isFile();
    } catch (err) {
        if (err.code != 'ENOENT') {
            throw err;
        }
    }
    return result;
}

/* Copy a file or a full directory */
internals.copyContent = (src, dest, event, options) => {
    // Check if both is directory
    if (fs.statSync(src).isDirectory() && fs.statSync(dest).isDirectory()) {
        let list = internals.list(src, { files: true });
        list.forEach((file) => {
            let srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            if (file.endsWith('.dust')) {
                internals.copyWithEvent(srcFile, destFile, event, options);
            } else if (!internals.exists(srcFile + '.dust')) {
                fs.copyFileSync(srcFile, destFile);
            }
        });
    } else {
        if (src.endsWith('.dust')) {
            internals.copyWithEvent(src, dest, event);
        } else if (!internals.exists(src + '.dust')) {
            fs.copyFileSync(src, dest);
        }
    }
};

/* Copy a file or a full directory */
internals.copy = (src, dest) => {
    // Check if both is directory
    if (fs.statSync(src).isDirectory() && fs.statSync(dest).isDirectory()) {
        let list = internals.list(src, { files: true });
        list.forEach(async (file) => {
            let srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            fs.copyFileSync(srcFile, destFile);
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

module.exports = {
    // Gets the directory names for single level (not recursive!)
    directories: (startPath) => {
        return internals.list(startPath, false);
    },
    // Gets the file names for single level or type if extension is specified
    files: (startPath, extension) => {
        return internals.list(startPath, true, extension);
    },
    // Read the file content
    read: (file, options) => {
        return internals.read(file, options);
    },
    // Write content to file
    write: (file, content, options) => {
        internals.write(file, content, options);
    },
    // Remove a single file or directory
    remove: (file) => {
        internals.remove(file);
    },
    // Rename a single file or directory
    rename: (oldPath, newPath) => {
        internals.rename(oldPath, newPath);
    },
    // Copy a single file or directory
    copy: (src, dest, event, options) => {
        if (typeof event === 'function') {
            internals.copyContent(src, dest, event, options);
        } else {
            internals.copy(src, dest);
        }
    },
    // Create directory
    createDir: (dir) => {
        internals.createDir(dir);
    },
    isDir: (file) => {
        return fs.statSync(file).isDirectory();
    },
    exists: (file) => {
        return internals.exists(file);
    }
    // Create file
    createFile: (file, content) => {
        internals.createFile(file, content);
    }
};