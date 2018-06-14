"use strict";

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({ camelize: true });
const runSequence = require('run-sequence').use(gulp);
const chokidar = require('chokidar');
const watchList = ['*.js', 'lib/**/*.js', 'plugins/**/*.js'];


gulp.task('lint', function () {
    return gulp.src(watchList)
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


gulp.task('watch', ['lint'], function () {
    let counter = 1;
    // Start dev server
    plugins.developServer.listen({ path: 'index.js' });
    // Start watching 
    chokidar.watch(watchList).on('change', (path) => {
        // Run the build
        console.log(`File "${path}" changed`);
        runSequence(['lint'], () => {
            plugins.developServer.restart();
            console.log('===============================================> Counter: ', counter++);
        });
    });
});


gulp.task('default', ['lint']);