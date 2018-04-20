"use strict";

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({ camelize: true });

gulp.task('lint', function () {
    let src = ['*.js', 'lib/**/*.js', 'plugins/**/*.js'];
    return gulp.src(src)
        .pipe(plugins.expectFile(src))
        .pipe(plugins.eslint('.eslintrc'))
        .pipe(plugins.eslint.format());
});


gulp.task('test', function () {
    let src = ['test/*.js', 'plugins/**/tests.js'];
    return gulp.src(src)
        //.pipe(plugins.lab('--reporter html --output temp/coverage.html'))
        .pipe(plugins.lab('--reporter console --timeout 0'))
        .on('error', plugins.util.log);
});


gulp.task('default', ['lint', 'test']);