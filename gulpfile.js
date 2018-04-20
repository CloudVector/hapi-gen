"use strict";

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({ camelize: true });

gulp.task('lint', function () {
    let src = ['index.js', 'lib/**/*.js', 'templates/**/*.js'];
    return gulp.src(src)
        .pipe(plugins.expectFile(src))
        .pipe(plugins.eslint('.eslintrc'))
        .pipe(plugins.eslint.format());
});

gulp.task('default', ['lint']);