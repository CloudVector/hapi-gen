"use strict";

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const plugins = require('gulp-load-plugins')({ camelize: true });
const pkg = require('./package.json');
let loadBundle = require('./lib/bundles.js');
let _bundle = null;

// Loads bundle (cached)
function getBundle () {
    if (_bundle === null) {
        _bundle = loadBundle();
    }
    return _bundle;
}

// View name extraction
function getViewName (file) {
    return file.relative;
}

// Copy source files first (if exists for the type)
function copyFiles (type, done) {
    let bundle = getBundle();
    if (bundle.hasOwnProperty(type) && bundle[type].copy && Array.isArray(bundle[type].copy.src) && typeof bundle[type].copy.dest === 'string') {
        gulp.src(bundle[type].copy.src).pipe(gulp.dest(bundle[type].copy.dest)).once('end', function () {
            if (done) {
                done();
            }
        });
    } else if (done) {
        done();
    }
}

gulp.task('compile-scss', function (done) {
    // Copy source files first, if needed
    let bundle = getBundle();
    copyFiles('scss', function () {
        // Combine all css files
        var stream = gulp.src(bundle.scss.client)
            .pipe(plugins.sass().on('error', function (err) {
                throw new plugins.util.PluginError(err);
            }))
            .pipe(plugins.concat('compiled.css'))
            .pipe(gulp.dest('src/css'));
        // Add events
        stream.on('end', function () {
            done();
        });
        stream.on('error', function (err) {
            done(err);
        });
    });
});


gulp.task('bundle-css', ['compile-scss'], function () {
    // Copy source files first, if needed
    let bundle = getBundle();
    copyFiles('css', function () {
        // Combine all css files for vendors
        gulp.src(bundle.css.vendor)
            .pipe(plugins.concat('vendor-' + pkg.vendorVersion + '.min.css'))
            .pipe(gulp.dest('public/css'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/css'));
        // Create client side
        return gulp.src(bundle.css.client)
            .pipe(plugins.cssmin())
            .pipe(plugins.concat('client-' + pkg.version + '.min.css'))
            .pipe(gulp.dest('public/css'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/css'));
    });
});


/*
gulp.task('lint', function () {
    let bundle = getBundle();
    return gulp.src(bundle.js.lint)
        .pipe(plugins.expectFile(bundle.js.lint))
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-stylish'));

});
*/


gulp.task('lint', function () {
    let bundle = getBundle();
    return gulp.src(bundle.js.lint)
        .pipe(plugins.expectFile(bundle.js.lint))
        .pipe(plugins.eslint('.eslintrc'))
        .pipe(plugins.eslint.format());
});



gulp.task('resources', function (done) {
    let bundle = getBundle();
    bundle.res = bundle.res || { "en": {}, "hu": {} };
    const template = `/*global window */
'use strict';

var resources = ${JSON.stringify(bundle.res, null, 4)};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = resources;
} else {
    window.hiso = window.hiso || {};
    window.hiso.language = 'en';
    window.hiso.resources = resources;
}`;
    // Write to temp folder
    fs.writeFile(path.join(__dirname, 'lib/resources.js'), template, (err) => {
        if (err) {
            console.log(err);
            err.plugin = 'resource';
            throw new plugins.util.PluginError(err);
        } else {
            done();
        }
    });
});


gulp.task('bundle-js', ['resources'], function () {
    let bundle = getBundle();
    // Copy source files first, if needed
    copyFiles('js', function () {
        // Combine all client code
        gulp.src(bundle.js.client)
            .pipe(plugins.concat('client-' + pkg.version + '.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.uglify().on('error', plugins.util.log))
            .pipe(plugins.concat('client-' + pkg.version + '.min.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/js'));
        // Combine all library files
        return gulp.src(bundle.js.vendor)
            .pipe(plugins.concat('vendor-' + pkg.vendorVersion + '.min.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/js'));
    });
});


gulp.task('bundle-img', function () {
    let bundle = getBundle();
    // Copy source files first, if needed
    copyFiles('img', function () {
        return gulp.src(bundle.img.client).pipe(gulp.dest('public/img'));
    });
});


gulp.task('bundle-font', function () {
    // Copy source files first, if needed
    copyFiles('font');
});


gulp.task('bundle-view', function () {
    let bundle = getBundle();
    // Copy source files first, if needed
    copyFiles('view', function () {
        // Combine all views for server side
        gulp.src(bundle.view.server)
            .pipe(plugins.expectFile(bundle.view.server))
            .pipe(plugins.replace('{vendorVersion}', pkg.vendorVersion)) // Replace tokens with real version numbers
            .pipe(plugins.replace('{clientVersion}', pkg.version))
            .pipe(plugins.dust({
                name: getViewName,
                preserveWhitespace: false
            }))
            .pipe(plugins.concat('views.min.js'))
            .pipe(gulp.dest('lib'));
        // Combine and compress client side views
        return gulp.src(bundle.view.client)
            .pipe(plugins.expectFile(bundle.view.client))
            .pipe(plugins.dust({
                name: getViewName,
                preserveWhitespace: false
            }))
            .pipe(plugins.concat('views-' + pkg.version + '.min.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/js'));
    });
});


gulp.task('watch', ['bundle'], function () {
    let bundle = getBundle();
    // Start dev server
    plugins.developServer.listen({ path: 'index.js' });

    gulp.watch(bundle.js.lint, function () {
        gulp.start(['lint', 'test', 'bundle-js'], function () {
            plugins.developServer.restart();
        });
    });

    gulp.watch(bundle.scss.client, function () {
        gulp.start(['bundle-css'], function () {
            plugins.developServer.restart();
        });
    });

    gulp.watch(bundle.css.client, function () {
        gulp.start(['bundle-css'], function () {
            plugins.developServer.restart();
        });
    });

    gulp.watch(bundle.css.server, function () {
        gulp.start(['bundle-css'], function () {
            plugins.developServer.restart();
        });
    });

    gulp.watch(bundle.view.server, function () {
        gulp.start(['bundle-view'], function () {
            plugins.developServer.restart();
        });
    });

    return gulp.watch(bundle.view.client, function () {
        gulp.start(['bundle-view'], function () {
            plugins.developServer.restart();
        });
    });
});


gulp.task('test', function () {
    let bundle = getBundle();
    return gulp.src(bundle.test)
        //.pipe(plugins.lab('--reporter html --output temp/coverage.html'))
        .pipe(plugins.lab('--reporter console --timeout 0'))
        .on('error', plugins.util.log);
});


gulp.task('bundle', ['lint', 'test', 'bundle-js', 'bundle-css', 'bundle-img', 'bundle-font', 'bundle-view']);
gulp.task('default', ['bundle']);