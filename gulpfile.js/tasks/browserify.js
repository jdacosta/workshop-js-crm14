var browserify   = require('browserify');
var gulp         = require('gulp');
var babel        = require('gulp-babel');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
var assign       = require('lodash.assign');
var buffer       = require('vinyl-buffer');
var source       = require('vinyl-source-stream');
var watchify     = require('watchify');
var config       = require('../config/browserify');
var maps         = require('../config/sourcemaps');
var handleErrors = require('../lib/handleErrors');

var opts = assign({}, watchify.args, config.browserify);
var bwatch = watchify(browserify(opts));

gulp.task('browserify', bundle);
bwatch.on('update', bundle);
bwatch.on('log', gutil.log);

function bundle () {
    return bwatch.bundle()
        .pipe(source(config.name))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(sourcemaps.write(maps.dest))
        .pipe(gulp.dest(config.dest));
}
