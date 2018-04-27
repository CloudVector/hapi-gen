"use strict";

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({ camelize: true });
const path = require('path');
const files = require('./lib/files.js');
const TEMPLATE_PATH = path.join(__dirname, 'templates');

function getLintSources () {
    let result = ['index.js', 'lib/**/*.js'];
    let list = files.directories(TEMPLATE_PATH);
    const addPath = (dir) => {
        result.push(dir + '/*.js');
        result.push(dir + '/lib/*.js');
        result.push(dir + '/js/*.js');
        result.push(dir + '/test/*.js');
        result.push(dir + '/plugins/**/*.js');
        result.push(dir + '/widgets/**/*.js');
    };
    list.forEach((item) => {
        let dir = path.join(TEMPLATE_PATH, item);
        addPath(dir);
        dir += '/dust';
        addPath(dir);
    });
    return result;
}

gulp.task('copy', (done) => {
    let list = files.directories(TEMPLATE_PATH);
    let src1 = path.join(__dirname, 'lib/files.js');
    let src2 = path.join(__dirname, 'test/test-files.js');
    const copyFile = (src, dir, name) => {
        files.createDir(dir);
        let dest = path.join(dir, name);
        files.copy(src, dest);
    };
    // Run a loop
    list.forEach((item) => {
        if (item === 'service-app') {
            copyFile(src1, path.join(__dirname, 'templates', item, 'lib'), 'files.js');
            copyFile(src2, path.join(__dirname, 'templates', item, 'test'), 'test-files.js');
        } else if (item === 'web-app') {
            copyFile(src1, path.join(__dirname, 'templates', item, 'dust', 'lib'), 'files.js');
            copyFile(src2, path.join(__dirname, 'templates', item, 'dust', 'test'), 'test-files.js');
        }
    });
    done();
});

gulp.task('lint', () => {
    let src = getLintSources();
    return gulp.src(src)
        .pipe(plugins.eslint('.eslintrc'))
        .pipe(plugins.eslint.format());
});

gulp.task('test', function () {
    let src = 'test/test*.js';
    return gulp.src(src)
        //.pipe(plugins.lab('--reporter html --output temp/coverage.html'))
        .pipe(plugins.lab('--reporter console --timeout 0'))
        .on('error', plugins.util.log);
});


gulp.task('default', ['copy', 'lint', 'test']);