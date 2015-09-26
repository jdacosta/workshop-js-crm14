var browserSync  = require('browser-sync');
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minify       = require('gulp-minify-css');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var config       = require('../config/sass');
var maps         = require('../config/sourcemaps');
var handleErrors = require('../lib/handleErrors');

gulp.task('sass', function () {
    return gulp.src(config.src)
        .pipe(sass(config.settings))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.init())
        .pipe(minify())
        .on('error', handleErrors)
        .pipe(sourcemaps.write(maps.dest))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({ stream: true }));
});
