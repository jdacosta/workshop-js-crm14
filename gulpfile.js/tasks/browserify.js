var babelify     = require('babelify');
var browserify   = require('browserify');
var gulp         = require('gulp');
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

var bwatch = watchify(
  browserify(opts)
    .add(require.resolve('babel/polyfill'))
    .transform(babelify.configure({ignore: ['node_modules', 'bower_components']}))
);

gulp.task('browserify', bundle);
bwatch.on('update', bundle);
bwatch.on('log', gutil.log);

function bundle () {
    return bwatch
        .bundle()
        .on('error', handleErrors)
        .pipe(source(config.name))
        .pipe(buffer())
        // .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify())
        // .pipe(sourcemaps.write(maps.dest))
        .pipe(gulp.dest(config.dest));
}
