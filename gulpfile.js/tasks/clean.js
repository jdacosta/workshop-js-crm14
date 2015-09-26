var del    = require('del');
var gulp   = require('gulp');
var config = require('../config');
var icons  = require('../config/icons');

gulp.task('clean', function (callback) {
    del([
        config.publicDirectory,
        config.serverDirectory,
        icons.sassDest
    ], callback);
});
