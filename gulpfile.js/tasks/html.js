var gulp         = require('gulp');
var minifyhtml   = require('gulp-minify-html');
var config       = require('../config/html');
var handleErrors = require('../lib/handleErrors');

gulp.task('html', function () {
    return gulp.src(config.src)
        .pipe(minifyhtml(config.minify))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.dest));
});
