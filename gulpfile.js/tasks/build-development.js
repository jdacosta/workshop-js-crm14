var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:development', function (callback) {
    gulpSequence(
        'clean',
        ['images', 'sounds', 'fonts', 'data'],
        ['sass', 'browserify', 'html', 'server'],
        ['watch'],
        callback
    );
});
