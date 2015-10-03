var babelify = require('babelify');
var gulp     = require('gulp');
var config   = require('../config/ssl');

gulp.task('ssl', function () {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});
