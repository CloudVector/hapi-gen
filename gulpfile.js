"use strict";

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({ camelize: true });
const path = require('path');
const files = require('./lib/files.js');
const TEMPLATE_PATH = path.join(__dirname, 'templates');

function getLintSources () {
    let result = ['index.js', 'lib/**/*.js'];
    let list = files.directories(TEMPLATE_PATH);
    list.forEach((item) => {
        let dir = path.join(TEMPLATE_PATH, item);
        result.push(dir + '*.js');
        result.push(dir + '/lib/*.js');
        result.push(dir + '/js/*.js');
        result.push(dir + '/test/*.js');
    });
    return result;
}

gulp.task('copy', (done) => {
    let list = files.directories(TEMPLATE_PATH);
    let src = path.join(__dirname, 'lib/files.js');
    list.forEach((item) => {
        let dir = path.join(__dirname, 'templates', item, 'lib');
        files.createDir(dir);
        let dest = path.join(dir, 'files.js');
        files.copy(src, dest);
    });
    done();
});

gulp.task('lint', () => {
    let src = getLintSources();
    console.log(src);
    return gulp.src(src)
        .pipe(plugins.eslint('.eslintrc'))
        .pipe(plugins.eslint.format());
});

gulp.task('default', ['copy', 'lint']);