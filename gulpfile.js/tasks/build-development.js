var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:development', function (callback) {
    gulpSequence(
        'clean',
        ['icons', 'images', 'sounds', 'fonts', 'data'],
        ['sass', 'browserify', 'html', 'server'],
        ['watch'],
        callback
    );
});
