var gulp         = require('gulp');
var config       = require('../config/server');

gulp.task('server', function () {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});
