var babelify = require('babelify');
var gulp     = require('gulp');
//var babel    = require('gulp-babel');
var config   = require('../config/server');

gulp.task('server', function () {
    return gulp.src(config.src)
        //.pipe(babel({ignore: ['node_modules', 'bower_components', 'ssl']}))
        .pipe(gulp.dest(config.dest));
});
