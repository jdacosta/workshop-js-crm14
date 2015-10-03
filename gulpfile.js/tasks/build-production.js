var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:production', function (callback) {
    process.env.NODE_ENV = 'production';
    gulpSequence(
        'clean',
        ['images', 'sounds', 'fonts', 'data'],
        ['sass', 'browserify', 'html', 'server', 'ssl'],
        callback
    );
});
