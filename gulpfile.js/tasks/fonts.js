var browserSync = require('browser-sync');
var gulp        = require('gulp');
var changed     = require('gulp-changed');
var config      = require('../config/fonts');

gulp.task('fonts', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({ stream: true }));
});
